using System.Net.Http.Headers;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.ResponseCompression;

var builder = WebApplication.CreateBuilder(args);

// ===== Compresión (gzip/br) para archivos estáticos =====
builder.Services.AddResponseCompression(o =>
{
    o.EnableForHttps = true;
    o.Providers.Add<BrotliCompressionProvider>();
    o.Providers.Add<GzipCompressionProvider>();
});

// ===== HttpClient para el proxy =====
builder.Services.AddHttpClient();

// ===== Leer base del API (env > appsettings > fallback) =====
var apiBase =
    Environment.GetEnvironmentVariable("API_BASE") ??
    builder.Configuration["ApiBase"] ??
    "https://hr-beneficios-api-grgmckc5dwdca9dc.canadacentral-01.azurewebsites.net";

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseResponseCompression();

// Si está detrás de proxy (IIS/Nginx/Azure)
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

// ===== Archivos estáticos y caché agresiva (menos index.html) =====
app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        var path = ctx.File.PhysicalPath ?? string.Empty;
        var isHtml = path.EndsWith("index.html", StringComparison.OrdinalIgnoreCase);
        ctx.Context.Response.Headers.CacheControl = isHtml
            ? "no-store"
            : "public, max-age=31536000, immutable";
    }
});

app.UseRouting();

// ===== Healthcheck =====
app.MapGet("/healthz", () => Results.Ok(new { ok = true }));

// ===== Proxy: /api/* → API_BASE (evita CORS) =====
app.MapWhen(ctx => ctx.Request.Path.StartsWithSegments("/api"), branch =>
{
    branch.Run(async context =>
    {
        var client = context.RequestServices.GetRequiredService<IHttpClientFactory>().CreateClient();

        // Construir URL destino preservando path y query
        var targetUri = new Uri($"{apiBase}{context.Request.Path}{context.Request.QueryString}");

        // Crear request saliente con mismo método
        var outbound = new HttpRequestMessage(new HttpMethod(context.Request.Method), targetUri);

        // Cuerpo (para POST/PUT/PATCH...)
        if (context.Request.ContentLength > 0 || context.Request.Body.CanRead)
        {
            outbound.Content = new StreamContent(context.Request.Body);
            // Copiar cabeceras de contenido si existen
            foreach (var h in context.Request.Headers)
            {
                if (h.Key.StartsWith("Content-", StringComparison.OrdinalIgnoreCase))
                    outbound.Content?.Headers.TryAddWithoutValidation(h.Key, h.Value.ToArray());
            }
        }

        // Copiar headers (excepto Host)
        foreach (var (key, value) in context.Request.Headers)
        {
            if (string.Equals(key, "Host", StringComparison.OrdinalIgnoreCase))
                continue;

            // Evita duplicar cabeceras restringidas
            if (!outbound.Headers.TryAddWithoutValidation(key, value.ToArray()))
                outbound.Content?.Headers.TryAddWithoutValidation(key, value.ToArray());
        }

        // Opcional: identifica al proxy
        outbound.Headers.UserAgent.Add(new ProductInfoHeaderValue("HR-Beneficios-Web", "1.0"));

        using var response = await client.SendAsync(
            outbound,
            HttpCompletionOption.ResponseHeadersRead,
            context.RequestAborted
        );

        // Copiar status y headers de respuesta
        context.Response.StatusCode = (int)response.StatusCode;

        foreach (var h in response.Headers)
            context.Response.Headers[h.Key] = h.Value.ToArray();

        foreach (var h in response.Content.Headers)
            context.Response.Headers[h.Key] = h.Value.ToArray();

        // Evitar cabeceras prohibidas por Kestrel
        context.Response.Headers.Remove("transfer-encoding");

        await response.Content.CopyToAsync(context.Response.Body, context.RequestAborted);
    });
});

// ===== SPA fallback =====
app.MapFallbackToFile("index.html");

app.Run();

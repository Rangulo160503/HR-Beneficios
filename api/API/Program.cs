using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Interfaces.Reglas;
using Abstracciones.Interfaces.Servicios;
using DA;
using Flujo;
using Reglas;
using Servicios;

var builder = WebApplication.CreateBuilder(args);

/* =========================
 * Logging
 * ========================= */
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

/* =========================
 * Feature flags / settings
 * - Activa errores detallados con:
 *   1) ASPNETCORE_ENVIRONMENT=Development  (o)
 *   2) DETAILED_ERRORS=1  (variable de aplicación en Azure)
 * ========================= */
bool detailedErrors =
    builder.Environment.IsDevelopment() ||
    string.Equals(builder.Configuration["DETAILED_ERRORS"], "1", StringComparison.OrdinalIgnoreCase) ||
    string.Equals(builder.Configuration["DETAILED_ERRORS"], "true", StringComparison.OrdinalIgnoreCase);

/* =========================
 * Infra básica
 * ========================= */
builder.Services.AddHttpClient();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

/* =========================
 * CORS
 * ========================= */
const string WebCors = "WebCors";
builder.Services.AddCors(o =>
{
    o.AddPolicy(WebCors, p =>
        p.SetIsOriginAllowed(origin =>
        {
            if (!Uri.TryCreate(origin, UriKind.Absolute, out var u)) return false;
            if (u.IsLoopback) return true; // localhost con cualquier puerto
            var host = u.Host.ToLowerInvariant();
            return host.EndsWith(".canadacentral-01.azurewebsites.net");
        })
        .AllowAnyHeader()
        .AllowAnyMethod()
        .WithExposedHeaders("Location")
    );
});

/* =========================
 * DI
 * ========================= */
builder.Services.AddScoped<IDapperWrapper, DA.Wrappers.DapperWrapper>();
builder.Services.AddScoped<IRepositorioDapper, DA.Repositorios.RepositorioDapper>();
builder.Services.AddScoped<IBeneficioDA, BeneficioDA>();
builder.Services.AddScoped<ICategoriaDA, CategoriaDA>();
builder.Services.AddScoped<IProveedorDA, ProveedorDA>();
builder.Services.AddScoped<IBeneficioFlujo, BeneficiosFlujo>();
builder.Services.AddScoped<ICategoriaFlujo, CategoriaFlujo>();
builder.Services.AddScoped<IProveedorFlujo, ProveedorFlujo>();
builder.Services.AddScoped<IBeneficiosServicio, BeneficiosServicio>();
builder.Services.AddScoped<IConfiguracion, Configuracion>();
builder.Services.AddScoped<IAreaDeCategoriaDA, AreaDeCategoriaDA>();
builder.Services.AddScoped<IAreaDeCategoriaFlujo, AreaDeCategoriaFlujo>();
// ===== Catálogos de filtros (nuevo) =====
builder.Services.AddScoped<IProductoDA, ProductoDA>();
builder.Services.AddScoped<IServicioDA, ServicioDA>();
builder.Services.AddScoped<IUbicacionDA, UbicacionDA>();

builder.Services.AddScoped<IProductoFlujo, ProductoFlujo>();
builder.Services.AddScoped<IServicioFlujo, ServicioFlujo>();
builder.Services.AddScoped<IUbicacionFlujo, UbicacionFlujo>();

builder.Services.AddScoped<IUsuarioFlujo, UsuarioFlujo>();
builder.Services.AddScoped<IUsuarioDA, UsuarioDA>();



var app = builder.Build();

/* =========================
 * Error handling + Diagnostics
 * ========================= */
if (detailedErrors)
{
    // Modo diagnóstico: muestra página de excepción con stack completo
    app.UseDeveloperExceptionPage();
}
else
{
    // Producción: JSON genérico + trace id; CORS amigable para el error
    app.UseExceptionHandler(errorApp =>
    {
        errorApp.Run(async context =>
        {
            var traceId = context.TraceIdentifier;
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;

            // Permitir que el cliente lea el error genérico respetando CORS del Origin
            var origin = context.Request.Headers["Origin"].ToString();
            if (Uri.TryCreate(origin, UriKind.Absolute, out _))
            {
                context.Response.Headers["Access-Control-Allow-Origin"] = origin;
                context.Response.Headers["Vary"] = "Origin";
                context.Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
                context.Response.Headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS";
            }

            await context.Response.WriteAsJsonAsync(new
            {
                message = "Internal Server Error",
                traceId
            });
        });
    });
}

// Opcional: páginas de estado simples (404, 405, etc.) en texto/JSON
app.UseStatusCodePages(context =>
{
    var resp = context.HttpContext.Response;
    // Evita interferir con respuestas API que ya envían cuerpo propio
    if (resp.ContentType is null or "" && resp.StatusCode != 204)
    {
        resp.ContentType = "application/json";
        return resp.WriteAsJsonAsync(new { status = resp.StatusCode });
    }
    return Task.CompletedTask;
});

/* =========================
 * Pipeline
 * ========================= */
app.UseHttpsRedirection();
app.UseRouting();
app.UseCors(WebCors);
app.UseAuthentication();
app.UseAuthorization();

// Swagger también en PROD: útil para probar rápidamente
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.RoutePrefix = "swagger";
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "HR-Beneficios API v1");
});

// Log básico de request/response para atrapar el 500 con trace-id
app.Use(async (ctx, next) =>
{
    var sw = System.Diagnostics.Stopwatch.StartNew();
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        ctx.RequestServices
           .GetRequiredService<ILoggerFactory>()
           .CreateLogger("Unhandled")
           .LogError(ex, "Unhandled exception: {Method} {Path} TraceId={TraceId}",
                     ctx.Request.Method, ctx.Request.Path, ctx.TraceIdentifier);
        throw; // lo captura el ExceptionHandler/DeveloperExceptionPage de arriba
    }
    finally
    {
        sw.Stop();
        var logger = ctx.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("Requests");
        logger.LogInformation("{Method} {Path} -> {Status} in {Elapsed}ms TraceId={TraceId}",
            ctx.Request.Method, ctx.Request.Path, ctx.Response.StatusCode, sw.ElapsedMilliseconds, ctx.TraceIdentifier);
    }
});

app.MapControllers().RequireCors(WebCors);

app.Run();

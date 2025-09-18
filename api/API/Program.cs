using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Interfaces.Reglas;
using Abstracciones.Interfaces.Servicios;
using DA;
using Flujo;
using Reglas;
using Servicios;

var builder = WebApplication.CreateBuilder(args);

// ⬅️ agrega logs a consola
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

builder.Services.AddHttpClient();

// === CORS ===
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

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// === DI ===
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

var app = builder.Build();

// ✅ Mostrar detalles en DEV; JSON genérico solo en PROD
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();

    // middlewarecito para LOG de excepciones no manejadas
    app.Use(async (ctx, next) =>
    {
        try { await next(); }
        catch (Exception ex)
        {
            app.Logger.LogError(ex, "Unhandled exception: {Method} {Path}", ctx.Request.Method, ctx.Request.Path);
            throw; // deja que DeveloperExceptionPage muestre el detalle
        }
    });

    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.RoutePrefix = "swagger";
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "HR-Beneficios API v1");
    });
}
else
{
    // Solo en PROD devolvemos cuerpo genérico
    app.UseExceptionHandler(errorApp =>
    {
        errorApp.Run(async context =>
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;

            var origin = context.Request.Headers["Origin"].ToString();
            if (Uri.TryCreate(origin, UriKind.Absolute, out _))
            {
                context.Response.Headers["Access-Control-Allow-Origin"] = origin;
                context.Response.Headers["Vary"] = "Origin";
                context.Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
                context.Response.Headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS";
            }

            await context.Response.WriteAsJsonAsync(new { message = "Internal Server Error" });
        });
    });
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors(WebCors);
app.UseAuthentication();   // ok si no hay auth: es no-op
app.UseAuthorization();

app.MapControllers().RequireCors(WebCors);

app.Run();

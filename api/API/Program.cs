using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Interfaces.Reglas;
using Abstracciones.Interfaces.Servicios;
using DA;
using Flujo;
using Reglas;
using Servicios;

var builder = WebApplication.CreateBuilder(args);
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
            // Ajusta el sufijo si cambias región o dominio
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
            // opcional: útiles si el error salta en un preflight que llegó aquí
            context.Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
            context.Response.Headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS";
        }

        await context.Response.WriteAsJsonAsync(new { message = "Internal Server Error" });
    });
});


// Swagger una sola vez:
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.RoutePrefix = string.Empty;
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "HR-Beneficios API v1");
    });
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors(WebCors);               // ← antes de Auth y de MapControllers
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers().RequireCors(WebCors);
app.Run();
using Abstracciones.Interfaces.Flujo;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace API.Middleware
{
    public class PortalProveedorMiddleware
    {
        private readonly RequestDelegate _next;

        public PortalProveedorMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IProveedorFlujo proveedorFlujo)
        {
            if (context.User?.Identity?.IsAuthenticated == true)
            {
                await _next(context);
                return;
            }

            if (!context.Request.Headers.TryGetValue("X-Token", out var tokenValues))
            {
                await _next(context);
                return;
            }

            var token = tokenValues.FirstOrDefault();

            if (string.IsNullOrWhiteSpace(token))
            {
                await _next(context);
                return;
            }

            var proveedor = await proveedorFlujo.ObtenerPorToken(token);

            if (proveedor is null)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsJsonAsync(new { ok = false, mensaje = "Token inválido o expirado." });
                return;
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, proveedor.ProveedorId.ToString()),
                new Claim(ClaimTypes.Name, proveedor.Nombre),
                new Claim(ClaimTypes.Role, "Proveedor")
            };

            context.User = new ClaimsPrincipal(new ClaimsIdentity(claims, "PortalProveedor"));

            await _next(context);
        }
    }
}

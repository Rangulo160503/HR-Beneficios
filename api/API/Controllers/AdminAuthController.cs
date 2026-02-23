using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Flujo;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminAuthController : ControllerBase
    {
        private readonly IAdminAuthFlujo _adminAuthFlujo;
        private readonly ILogger<AdminAuthController> _logger;

        public AdminAuthController(IAdminAuthFlujo adminAuthFlujo, ILogger<AdminAuthController> logger)
        {
            _adminAuthFlujo = adminAuthFlujo ?? throw new ArgumentNullException(nameof(adminAuthFlujo));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AdminLoginRequest request)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            try
            {
                var result = await _adminAuthFlujo.Login(request);
                if (result is null)
                    return Unauthorized(new { message = "Credenciales inválidas" });

                // 1) sacar el token (ajusta el nombre según tu DTO real)
                var token = result.Token;

                if (string.IsNullOrWhiteSpace(token))
                    return StatusCode(StatusCodes.Status500InternalServerError,
                        new { message = "Login OK pero no se generó token." });

                // 2) setear cookie httpOnly
                Response.Cookies.Append("hr_auth", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,                 // estás en https://localhost:5001
                    SameSite = SameSiteMode.Lax,
                    Expires = DateTimeOffset.UtcNow.AddHours(8),
                    Path = "/"
                });

                // 3) devolver respuesta mínima (sin token)
                return Ok(new { ok = true });
            }
            catch (InactiveAdminException ex)
            {
                _logger.LogWarning(ex, "Intento de login de usuario inactivo: {Usuario}", request.Usuario);
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Usuario inactivo" });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var usuario = User.Identity?.Name;
            if (string.IsNullOrWhiteSpace(usuario))
            {
                return Unauthorized();
            }

            var profile = await _adminAuthFlujo.ObtenerPerfil(usuario);
            return profile is null ? Unauthorized() : Ok(profile);
        }
    }
}

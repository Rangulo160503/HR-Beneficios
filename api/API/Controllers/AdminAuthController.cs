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
                {
                    return Unauthorized(new { message = "Credenciales inválidas" });
                }

                return Ok(result);
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

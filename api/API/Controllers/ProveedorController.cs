using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProveedorController : ControllerBase, IProveedorController
    {
        private IProveedorFlujo _proveedorFlujo;
        private ILogger<ProveedorController> _logger;

        public ProveedorController(IProveedorFlujo proveedorFlujo, ILogger<ProveedorController> logger)
        {
            _proveedorFlujo = proveedorFlujo;
            _logger = logger;
        }

        #region Operaciones
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Agregar([FromBody] ProveedorRequest proveedor)
        {
            if (string.IsNullOrWhiteSpace(proveedor?.Nombre))
                return BadRequest("El nombre es requerido.");

            var id = await _proveedorFlujo.Agregar(proveedor);
            var creado = await _proveedorFlujo.Obtener(id);
            return CreatedAtAction(nameof(Obtener), new { Id = id }, creado);

        }

        [HttpPut("{Id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Editar([FromRoute] Guid Id, [FromBody] ProveedorRequest proveedor)
        {
            // Validación de entrada
            if (string.IsNullOrWhiteSpace(proveedor?.Nombre))
                return BadRequest("El nombre es requerido.");

            // 404 si no existe
            var actual = await _proveedorFlujo.Obtener(Id);
            if (actual is null)
                return NotFound("El proveedor no existe");

            try
            {
                var resultado = await _proveedorFlujo.Editar(Id, proveedor); // debe llamar a core.EditarProveedor
                return Ok(resultado); // { proveedorId, nombre, modificadoEn }
            }
            // (Opcional) Mapear códigos de la SP a HTTP adecuados
            catch (SqlException ex) when (ex.Number == 52112) // "nombre duplicado"
            {
                return Conflict("Ya existe un proveedor con ese nombre.");
            }
        }

        [HttpDelete("{Id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Eliminar([FromRoute] Guid Id)
        {
            var actual = await _proveedorFlujo.Obtener(Id);
            if (actual is null) return NotFound("El proveedor no existe");

            try
            {
                await _proveedorFlujo.Eliminar(Id);
                return NoContent();
            }
            catch (SqlException ex) when (ex.Number == 51003) // "tiene beneficios asociados"
            {
                return Conflict("No se puede eliminar el proveedor: tiene beneficios asociados.");
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Obtener()
        {
            var resultado = await _proveedorFlujo.Obtener();
            if (!resultado.Any())
                return NoContent();

            return Ok(resultado);
        }

        [HttpGet("{Id:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> Obtener([FromRoute] Guid Id)
        {
            var resultado = await _proveedorFlujo.Obtener(Id);
            return Ok(resultado);
        }

        [HttpGet("validar-login/{Id:guid}")]
        [Authorize(Roles = "Proveedor")]
        public async Task<IActionResult> ValidarLogin([FromRoute] Guid Id)
        {
            var claimId = User.FindFirst("proveedorId")?.Value;
            if (!Guid.TryParse(claimId, out var proveedorId) || proveedorId != Id)
            {
                return Unauthorized(new { ok = false, mensaje = "Token inválido." });
            }

            var existe = await _proveedorFlujo.ExisteProveedor(proveedorId);

            if (!existe)
                return NotFound(new { ok = false, mensaje = "QR inválido o proveedor no encontrado." });

            return Ok(new { ok = true, mensaje = "Proveedor válido." });
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] ProveedorLoginRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Token))
                return BadRequest(new { ok = false, mensaje = "Token inválido." });

            try
            {
                var login = await _proveedorFlujo.LoginPorToken(request);
                return Ok(login);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { ok = false, mensaje = "Token inválido." });
            }
        }

        [HttpGet("me")]
        [Authorize(Roles = "Proveedor")]
        public async Task<IActionResult> Me()
        {
            var claimId = User.FindFirst("proveedorId")?.Value;
            if (!Guid.TryParse(claimId, out var proveedorId))
            {
                return Unauthorized(new { ok = false, mensaje = "Token inválido." });
            }

            var sesion = await _proveedorFlujo.ValidarSesionProveedor(proveedorId);
            if (sesion is null)
            {
                return Unauthorized(new { ok = false, mensaje = "Token inválido." });
            }

            return Ok(sesion);
        }
        #endregion

        #region Helpers
        private async Task<bool> VerificarProveedorExiste(Guid Id)
        {
            var resultadoValidacion = false;
            var resultadoProveedorExiste = await _proveedorFlujo.Obtener(Id);
            if (resultadoProveedorExiste != null)
                resultadoValidacion = true;
            return resultadoValidacion;
        }
        #endregion
    }
}

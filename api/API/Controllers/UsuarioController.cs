using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioFlujo _usuarioFlujo;
        private readonly ILogger<UsuarioController> _logger;

        public UsuarioController(IUsuarioFlujo usuarioFlujo, ILogger<UsuarioController> logger)
        {
            _usuarioFlujo = usuarioFlujo;
            _logger = logger;
        }

        // POST api/Usuario
        [HttpPost]
        public async Task<IActionResult> Agregar([FromBody] UsuarioRequest req)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var id = await _usuarioFlujo.Agregar(req);
            var creado = await _usuarioFlujo.Obtener(id);
            return CreatedAtAction(nameof(Obtener), new { Id = id }, creado);
        }

        // PUT api/Usuario/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Editar(Guid id, [FromBody] UsuarioRequest req)
        {
            if (!await VerificarUsuarioExiste(id))
                return NotFound("El usuario no existe");

            await _usuarioFlujo.Editar(id, req);
            var actualizado = await _usuarioFlujo.Obtener(id);
            return Ok(actualizado);
        }

        // DELETE api/Usuario/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Eliminar(Guid id)
        {
            if (!await VerificarUsuarioExiste(id))
                return NotFound("El usuario no existe");

            await _usuarioFlujo.Eliminar(id);
            return NoContent();
        }

        // GET api/Usuario
        [HttpGet]
        public async Task<IActionResult> Obtener()
        {
            var lista = await _usuarioFlujo.Obtener();
            return Ok(lista ?? Enumerable.Empty<UsuarioResponse>());
        }

        // GET api/Usuario/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> Obtener([FromRoute] Guid id)
        {
            var item = await _usuarioFlujo.Obtener(id);
            return item is null ? NotFound() : Ok(item);
        }

        // === Gestión de proveedor ===
        [HttpPut("asignar-proveedor")]
        public async Task<IActionResult> AsignarProveedor([FromBody] UsuarioAsignarProveedorRequest req)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            if (!await VerificarUsuarioExiste(req.UsuarioId))
                return NotFound("El usuario no existe");

            await _usuarioFlujo.AsignarProveedor(req.UsuarioId, req.ProveedorId);
            var actualizado = await _usuarioFlujo.Obtener(req.UsuarioId);
            return Ok(actualizado);
        }

        [HttpPut("{id:guid}/quitar-proveedor")]
        public async Task<IActionResult> QuitarProveedor([FromRoute] Guid id)
        {
            if (!await VerificarUsuarioExiste(id))
                return NotFound("El usuario no existe");

            await _usuarioFlujo.QuitarProveedor(id);
            var actualizado = await _usuarioFlujo.Obtener(id);
            return Ok(actualizado);
        }

        private async Task<bool> VerificarUsuarioExiste(Guid id)
            => await _usuarioFlujo.Obtener(id) is not null;
    }
}

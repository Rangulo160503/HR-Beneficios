using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class UbicacionController : ControllerBase
    {
        private readonly IUbicacionFlujo _flujo;
        private readonly ILogger<UbicacionController> _logger;

        public UbicacionController(IUbicacionFlujo flujo, ILogger<UbicacionController> logger)
        {
            _flujo = flujo;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Obtener()
        {
            var lista = await _flujo.Obtener();
            return Ok(lista ?? Enumerable.Empty<Ubicacion>());
        }

        [HttpGet("{Id:guid}")]
        public async Task<IActionResult> Obtener(Guid Id)
        {
            var item = await _flujo.Obtener(Id);
            return item is null || item.UbicacionId == Guid.Empty ? NotFound() : Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Agregar([FromBody] Ubicacion body)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);
            var id = await _flujo.Agregar(body);
            var creado = await _flujo.Obtener(id);
            return CreatedAtAction(nameof(Obtener), new { Id = id }, creado);
        }

        [HttpPut("{Id:guid}")]
        public async Task<IActionResult> Editar(Guid Id, [FromBody] Ubicacion body)
        {
            if (!await Existe(Id)) return NotFound("La ubicación no existe");
            await _flujo.Editar(Id, body);
            var actualizado = await _flujo.Obtener(Id);
            return Ok(actualizado);
        }

        [HttpDelete("{Id:guid}")]
        public async Task<IActionResult> Eliminar(Guid Id)
        {
            if (!await Existe(Id)) return NotFound("La ubicación no existe");
            await _flujo.Eliminar(Id);
            return NoContent();
        }

        private async Task<bool> Existe(Guid id)
        {
            var dto = await _flujo.Obtener(id);
            return dto is not null && dto.UbicacionId != Guid.Empty;
        }
    }
}

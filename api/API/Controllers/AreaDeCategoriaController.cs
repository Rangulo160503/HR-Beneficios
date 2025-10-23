using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AreaDeCategoriaController : ControllerBase, IAreaDeCategoriaController
    {
        private readonly IAreaDeCategoriaFlujo _flujo;
        private readonly ILogger<AreaDeCategoriaController> _logger;

        public AreaDeCategoriaController(
            IAreaDeCategoriaFlujo flujo,
            ILogger<AreaDeCategoriaController> logger)
        {
            _flujo = flujo ?? throw new ArgumentNullException(nameof(flujo));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // GET api/AreaDeCategoria
        [HttpGet]
        public async Task<IActionResult> Obtener()
        {
            var lista = await _flujo.Obtener();
            return Ok(lista ?? Enumerable.Empty<AreaDeCategoriaResponse>());
        }

        // GET api/AreaDeCategoria/{Id}
        [HttpGet("{Id:guid}")]
        public async Task<IActionResult> Obtener(Guid Id)
        {
            var item = await _flujo.Obtener(Id);
            return item is null ? NotFound() : Ok(item);
        }

        // POST api/AreaDeCategoria
        [HttpPost]
        public async Task<IActionResult> Agregar([FromBody] AreaDeCategoriaRequest areacategoria)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            var id = await _flujo.Agregar(areacategoria);
            var creado = await _flujo.Obtener(id);
            return CreatedAtAction(nameof(Obtener), new { Id = id }, creado);
        }

        // PUT api/AreaDeCategoria/{Id}
        [HttpPut("{Id:guid}")]
        public async Task<IActionResult> Editar(Guid Id, [FromBody] AreaDeCategoriaRequest areacategoria)
        {
            if (!await VerificarAreaExiste(Id))
                return NotFound("El área no existe.");

            await _flujo.Editar(Id, areacategoria);
            var actualizado = await _flujo.Obtener(Id);
            return Ok(actualizado);
        }

        // DELETE api/AreaDeCategoria/{Id}
        [HttpDelete("{Id:guid}")]
        public async Task<IActionResult> Eliminar(Guid Id)
        {
            if (!await VerificarAreaExiste(Id))
                return NotFound("El área no existe.");

            await _flujo.Eliminar(Id);
            return NoContent();
        }

        // ===== Helper =====
        private async Task<bool> VerificarAreaExiste(Guid Id)
            => (await _flujo.Obtener(Id)) is not null;
    }
}
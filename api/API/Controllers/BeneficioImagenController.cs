using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BeneficioImagenController : ControllerBase, IBeneficioImagenController
    {
        private readonly IBeneficioImagenFlujo _beneficioImagenFlujo;
        private readonly ILogger<BeneficioImagenController> _logger;

        public BeneficioImagenController(IBeneficioImagenFlujo beneficioImagenFlujo, ILogger<BeneficioImagenController> logger)
        {
            _beneficioImagenFlujo = beneficioImagenFlujo ?? throw new ArgumentNullException(nameof(beneficioImagenFlujo));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // 📋 GET api/BeneficioImagen/{beneficioId}
        [HttpGet("{beneficioId:guid}")]
        public async Task<IActionResult> Obtener(Guid beneficioId)
        {
            var lista = await _beneficioImagenFlujo.Obtener(beneficioId);
            return Ok(lista ?? Enumerable.Empty<BeneficioImagenResponse>());
        }

        // 🔍 GET api/BeneficioImagen/detalle/{imagenId}
        [HttpGet("detalle/{imagenId:guid}")]
        public async Task<IActionResult> ObtenerPorId(Guid imagenId)
        {
            var item = await _beneficioImagenFlujo.ObtenerPorId(imagenId);
            return item is null ? NotFound() : Ok(item);
        }

        // ➕ POST api/BeneficioImagen
        [HttpPost]
        [RequestSizeLimit(20_000_000)]
        public async Task<IActionResult> Agregar([FromBody] BeneficioImagenRequest req)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            var id = await _beneficioImagenFlujo.Agregar(req);
            var creado = await _beneficioImagenFlujo.ObtenerPorId(id);

            return CreatedAtAction(nameof(ObtenerPorId), new { imagenId = id }, creado);
        }

        // ✏️ PUT api/BeneficioImagen/{imagenId}
        [HttpPut("{imagenId:guid}")]
        [RequestSizeLimit(20_000_000)]
        public async Task<IActionResult> Editar(Guid imagenId, [FromBody] BeneficioImagenRequest req)
        {
            var existente = await _beneficioImagenFlujo.ObtenerPorId(imagenId);
            if (existente == null)
                return NotFound("La imagen no existe.");

            await _beneficioImagenFlujo.Editar(imagenId, req);
            var actualizado = await _beneficioImagenFlujo.ObtenerPorId(imagenId);

            return Ok(actualizado);
        }

        // ❌ DELETE api/BeneficioImagen/{imagenId}
        [HttpDelete("{imagenId:guid}")]
        public async Task<IActionResult> Eliminar(Guid imagenId)
        {
            var existente = await _beneficioImagenFlujo.ObtenerPorId(imagenId);
            if (existente == null)
                return NotFound("La imagen no existe.");

            await _beneficioImagenFlujo.Eliminar(imagenId);
            return NoContent();
        }
    }
}

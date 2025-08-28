using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BeneficioController : ControllerBase
    {
        private readonly IBeneficioFlujo _flujo;
        private readonly ILogger<BeneficioController> _logger;

        public BeneficioController(IBeneficioFlujo flujo, ILogger<BeneficioController> logger)
        {
            _flujo = flujo;
            _logger = logger;
        }

        // GET api/beneficio/publicados
        [HttpGet("publicados")]
        public async Task<IActionResult> ObtenerPublicados()
        {
            var items = await _flujo.Obtener();
            if (!items.Any()) return NoContent();
            return Ok(items);
        }

        // GET api/beneficio/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> Obtener([FromRoute] Guid id)
        {
            var item = await _flujo.Obtener(id);
            return Ok(item);
        }

        // POST api/beneficio
        [HttpPost]
        public async Task<IActionResult> Agregar([FromBody] BeneficioRequest req)
        {
            var id = await _flujo.Agregar(req);
            return CreatedAtAction(nameof(Obtener), new { id }, null);
        }

        // PUT api/beneficio/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Editar([FromRoute] Guid id, [FromBody] BeneficioRequest req)
        {
            var outId = await _flujo.Editar(id, req);
            return Ok(outId);
        }

        // DELETE api/beneficio/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Eliminar([FromRoute] Guid id)
        {
            var outId = await _flujo.Eliminar(id);
            return NoContent();
        }
    }
}

using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Abstracciones.Modelos.Servicios.Beneficios;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BeneficioController : ControllerBase, IBeneficioController
    {
        private readonly IBeneficioFlujo _beneficioFlujo;
        private readonly ILogger<BeneficioController> _logger;

        public BeneficioController(IBeneficioFlujo beneficioFlujo, ILogger<BeneficioController> logger)
        {
            _beneficioFlujo = beneficioFlujo;
            _logger = logger;
        }

        #region Operaciones (orden como en VehiculoController)

        // POST api/beneficio
        [HttpPost]
        public async Task<IActionResult> Agregar([FromBody] BeneficioRequest beneficio)
        {
            var id = await _beneficioFlujo.Agregar(beneficio);
            var creado = await _beneficioFlujo.Obtener(id); // BeneficioDetalle? (puede ser null)

            return CreatedAtAction(nameof(Obtener), new { id }, (object)creado ?? new { id });
        }

        // PUT api/beneficio/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Editar([FromRoute] Guid id, [FromBody] BeneficioRequest req)
        {
            if (!await Existe(id))
                return NotFound("El beneficio no existe");

            var outId = await _beneficioFlujo.Editar(id, req);
            return Ok(outId);
        }

        // DELETE api/beneficio/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Eliminar([FromRoute] Guid id)
        {
            if (!await Existe(id))
                return NotFound("El beneficio no existe");

            await _beneficioFlujo.Eliminar(id);
            return NoContent();
        }

        // GET api/beneficio
        [HttpGet]
        public async Task<IActionResult> Obtener()
        {
            var items = await _beneficioFlujo.Obtener(); // IEnumerable<BeneficioResponse>
            return Ok(items ?? Enumerable.Empty<BeneficioResponse>()); // 200 []
        }

        // GET api/beneficio/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> Obtener([FromRoute] Guid id)
        {
            var item = await _beneficioFlujo.Obtener(id); // BeneficioDetalle?
            return item is null ? NotFound() : Ok(item);
        }

        #endregion Operaciones

        #region Consultas de dominio

        // GET api/beneficio/publicados
        [HttpGet("publicados")]
        public async Task<IActionResult> ObtenerPublicados()
        {
            // Si tenés un método específico (p.ej., ListarPublicadosVigentesAsync), úsalo aquí.
            var items = await _beneficioFlujo.Obtener(); // IEnumerable<BeneficioResponse>
            return Ok(items ?? Enumerable.Empty<BeneficioResponse>());
        }

        #endregion Consultas de dominio

        #region Helpers
        private async Task<bool> Existe(Guid id) => (await _beneficioFlujo.Obtener(id)) is not null;
        #endregion
    }
}

using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
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
        #region Operaciones

        [HttpPost]
        public async Task<IActionResult> Agregar([FromBody] BeneficioRequest beneficio)
        {
            var resultado = await _beneficioFlujo.Agregar(beneficio);
            return CreatedAtAction(nameof(Obtener), new { Id = resultado }, null);
        }
        [HttpPut("{Id}")]
        public async Task<IActionResult> Editar([FromRoute] Guid Id, [FromBody] BeneficioRequest beneficio)
        {
            if (!await VerificarBeneficioExiste(Id))
                return NotFound("El vehículo no existe");
            var resultado = await _beneficioFlujo.Editar(Id, beneficio);
            return Ok(resultado);
        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> Eliminar([FromRoute] Guid Id)
        {
            if (!await VerificarBeneficioExiste(Id))
                return NotFound("El beneficio no existe");
            var resultado = await _beneficioFlujo.Eliminar(Id);
            return NoContent();
        }
        [HttpGet]
        public async Task<IActionResult> Obtener()
        {
            var resultado = await _beneficioFlujo.Obtener();
            if (!resultado.Any())
                return NoContent();
            return Ok(resultado);
        }
        [HttpGet("{Id}")]
        public async Task<IActionResult> Obtener([FromRoute] Guid Id)
        {
            var resultado = await _beneficioFlujo.Obtener(Id);
            return Ok(resultado);
        }
#endregion Operaciones

        #region Helpers
        private async Task<bool> VerificarBeneficioExiste(Guid Id)
        {
            var resultadoValidacion = false;
            var resultadoBeneficioExiste = await _beneficioFlujo.Obtener(Id);
            if (resultadoBeneficioExiste != null)
                resultadoValidacion = true;
            return resultadoValidacion;
        }
        #endregion
    }
}

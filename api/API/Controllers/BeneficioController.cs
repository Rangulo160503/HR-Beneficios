using Abstracciones.Interfaces.Flujo;
using Flujo;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BeneficioController : ControllerBase
    {
        private readonly IBeneficioFlujo _beneficioFlujo;

        public BeneficioController(IBeneficioFlujo beneficioFlujo)
        {
            _beneficioFlujo = beneficioFlujo;
        }

        [HttpGet]
        public async Task<IActionResult> Obtener()
        {
            var beneficios = await _beneficioFlujo.Obtener();
            if (beneficios == null || !beneficios.Any())
                return NoContent();
            return Ok(beneficios);
        }
    }
}
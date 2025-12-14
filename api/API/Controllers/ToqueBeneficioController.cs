using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToqueBeneficioController : ControllerBase, IToqueBeneficioController
    {
        private readonly IToqueBeneficioFlujo _toqueBeneficioFlujo;
        private readonly ILogger<ToqueBeneficioController> _logger;

        public ToqueBeneficioController(IToqueBeneficioFlujo toqueBeneficioFlujo, ILogger<ToqueBeneficioController> logger)
        {
            _toqueBeneficioFlujo = toqueBeneficioFlujo;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Registrar([FromBody] ToqueBeneficioRequest request)
        {
            if (request is null || string.IsNullOrWhiteSpace(request.BeneficioId))
                return BadRequest("beneficioId es requerido");

            if (!Guid.TryParse(request.BeneficioId, out var beneficioId))
                return BadRequest("beneficioId debe ser un GUID");

            var toque = await _toqueBeneficioFlujo.Registrar(beneficioId, request.Origen);
            return CreatedAtAction(nameof(ObtenerAnalytics), new { beneficioId }, toque);
        }

        [HttpGet("analytics/{beneficioId:guid}")]
        public async Task<IActionResult> ObtenerAnalytics([FromRoute] Guid beneficioId, [FromQuery] string? range = "1W")
        {
            var analytics = await _toqueBeneficioFlujo.ObtenerAnalytics(beneficioId, range);
            return Ok(analytics);
        }
    }
}

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

        // POST api/Beneficio
        [HttpPost]
        [RequestSizeLimit(20_000_000)]
        public async Task<IActionResult> Agregar([FromBody] BeneficioRequest req)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            // Validar FKs, etc…

            // req.Imagen ya viene como byte[] si en JSON te mandan base64
            var id = await _beneficioFlujo.Agregar(req); // tu flujo/DA inserta Imagen = @Imagen
            var creado = await _beneficioFlujo.Obtener(id);
            return CreatedAtAction(nameof(Obtener), new { Id = id }, creado);
        }

        // PUT api/Beneficio/{Id}
        [HttpPut("{Id:guid}")]
        [RequestSizeLimit(20_000_000)]
        public async Task<IActionResult> Editar(Guid Id, [FromBody] BeneficioRequest req)
        {
            if (!await VerificarBeneficioExiste(Id)) return NotFound("El beneficio no existe");

            // Si Imagen viene null, conservar la existente (no sobreescribir con NULL)
            await _beneficioFlujo.Editar(Id, req); // ver SQL abajo

            var actualizado = await _beneficioFlujo.Obtener(Id);
            return Ok(actualizado);
        }

        // DELETE api/Beneficio/{Id}
        [HttpDelete("{Id:guid}")]
        public async Task<IActionResult> Eliminar([FromRoute] Guid Id)
        {
            if (!await VerificarBeneficioExiste(Id))
                return NotFound("El beneficio no existe");

            await _beneficioFlujo.Eliminar(Id);
            return NoContent();
        }

        // GET api/Beneficio
        [HttpGet]
        public async Task<IActionResult> Obtener()
        {
            var lista = await _beneficioFlujo.Obtener();
            return Ok(lista ?? Enumerable.Empty<BeneficioResponse>());
        }

        // GET api/Beneficio/{Id}
        [HttpGet("{Id:guid}")]
        public async Task<IActionResult> Obtener([FromRoute] Guid Id)
        {
            var item = await _beneficioFlujo.Obtener(Id);
            return item is null ? NotFound() : Ok(item);
        }

        // ===== Helpers =====
        private async Task<bool> VerificarBeneficioExiste(Guid Id)
            => await _beneficioFlujo.Obtener(Id) is not null;
    }
}

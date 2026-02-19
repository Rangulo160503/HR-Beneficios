using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace API.Controllers
{
    [Authorize(Roles = "Admin")]
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
        [AllowAnonymous]
        public async Task<IActionResult> Agregar(
            [FromBody] BeneficioRequest req,
            [FromQuery] Guid proveedorId,
            [FromQuery] string token)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            var esValido = await _beneficioFlujo.ValidarTokenBadge(proveedorId, token);
            if (!esValido)
                return Unauthorized("Token inválido o vencido.");

            req.ProveedorId = proveedorId;

            var id = await _beneficioFlujo.Agregar(req);
            var creado = await _beneficioFlujo.Obtener(id);

            return CreatedAtAction(nameof(Obtener), new { Id = id }, creado);
        }

        // PUT api/Beneficio/{Id}
        [HttpPut("{Id:guid}")]
        [RequestSizeLimit(20_000_000)]
        [AllowAnonymous]
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
        [AllowAnonymous]
        public async Task<IActionResult> Eliminar([FromRoute] Guid Id)
        {
            if (!await VerificarBeneficioExiste(Id))
                return NotFound("El beneficio no existe");

            await _beneficioFlujo.Eliminar(Id);
            return NoContent();
        }

        // GET api/Beneficio
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Obtener()
        {
            var lista = await _beneficioFlujo.ObtenerAprobados();
            return Ok(lista ?? Enumerable.Empty<BeneficioResponse>());
        }

        // GET api/Beneficio/{Id}
        [HttpGet("{Id:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> Obtener([FromRoute] Guid Id)
        {
            var item = await _beneficioFlujo.Obtener(Id);
            return item is null ? NotFound() : Ok(item);
        }

        // GET api/Beneficio/pendientes
        [HttpGet("pendientes")]
        [AllowAnonymous]
        public async Task<IActionResult> ObtenerPendientes()
        {
            var lista = await _beneficioFlujo.ObtenerPendientes();
            return Ok(lista ?? Enumerable.Empty<BeneficioResponse>());
        }
        // GET api/Beneficio/rechazados
        [HttpGet("rechazados")]
        [AllowAnonymous]
        public async Task<IActionResult> ObtenerRechazados()
        {
            var lista = await _beneficioFlujo.ObtenerRechazados();
            return Ok(lista ?? Enumerable.Empty<BeneficioResponse>());
        }

        // PUT api/Beneficio/{Id}/aprobar
        [HttpPut("{Id:guid}/aprobar")]
        public async Task<IActionResult> Aprobar([FromRoute] Guid Id)
        {
            if (!await VerificarBeneficioExiste(Id)) return NotFound("El beneficio no existe");

            await _beneficioFlujo.Aprobar(Id, null);
            return NoContent();
        }

        // PUT api/Beneficio/{Id}/rechazar
        [HttpPut("{Id:guid}/rechazar")]
        public async Task<IActionResult> Rechazar([FromRoute] Guid Id)
        {
            if (!await VerificarBeneficioExiste(Id)) return NotFound("El beneficio no existe");

            await _beneficioFlujo.Rechazar(Id, null);
            return NoContent();
        }

        // GET api/Beneficio/por-categoria/{categoriaId}
        [HttpGet("por-categoria/{categoriaId:guid}")]
        public async Task<IActionResult> ObtenerPorCategoria(
            [FromRoute] Guid categoriaId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50,
            [FromQuery] string? search = null)
        {
            if (categoriaId == Guid.Empty) return BadRequest("categoriaId inválido");
            var result = await _beneficioFlujo.ObtenerPorCategoria(categoriaId, page, pageSize, search);
            return Ok(result);
        }

        // PUT api/Beneficio/reasignar-categoria
        [HttpPut("reasignar-categoria")]
        public async Task<IActionResult> ReasignarCategoria([FromBody] ReasignarCategoriaRequest body)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);
            if (body.FromCategoriaId == Guid.Empty || body.ToCategoriaId == Guid.Empty)
                return BadRequest("Debe indicar categorías válidas.");
            if (body.FromCategoriaId == body.ToCategoriaId)
                return BadRequest("La categoría destino debe ser diferente.");

            await _beneficioFlujo.ReasignarCategoria(
                body.FromCategoriaId,
                body.ToCategoriaId,
                body.BeneficioIds?.Where(id => id != Guid.Empty));

            return NoContent();
        }


        // ===== Helpers =====
        private async Task<bool> VerificarBeneficioExiste(Guid Id)
        {
            var b = await _beneficioFlujo.Obtener(Id);
            return b is not null && b.BeneficioId != Guid.Empty;
        }
    }
}

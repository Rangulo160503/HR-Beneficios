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
    public class InfoBoardController : ControllerBase, IInfoBoardController
    {
        private readonly IInfoBoardFlujo _infoBoardFlujo;
        private readonly ILogger<InfoBoardController> _logger;

        public InfoBoardController(IInfoBoardFlujo infoBoardFlujo, ILogger<InfoBoardController> logger)
        {
            _infoBoardFlujo = infoBoardFlujo ?? throw new ArgumentNullException(nameof(infoBoardFlujo));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpGet]
        public async Task<IActionResult> Obtener([FromQuery] bool? activo = true, [FromQuery(Name = "q")] string? busqueda = null)
        {
            var resultado = await _infoBoardFlujo.Obtener(activo, busqueda);

            if (!resultado.Any())
                return NoContent();

            return Ok(resultado);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> Obtener([FromRoute] Guid id)
        {
            var item = await _infoBoardFlujo.Obtener(id);
            if (item == null)
                return NotFound();

            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Agregar([FromBody] InfoBoardItemRequest item)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            /*
             * Ejemplo de payload:
             * {
             *   "titulo": "Charla: Finanzas personales 2025",
             *   "descripcion": "Inscribite en la charla virtual con cupo limitado.",
             *   "url": "https://empresa.com/charla-finanzas",
             *   "tipo": "charla",
             *   "prioridad": 10,
             *   "activo": true,
             *   "fechaInicio": "2025-12-14T00:00:00",
             *   "fechaFin": "2026-01-14T23:59:59"
             * }
             */

            var id = await _infoBoardFlujo.Agregar(item);
            var creado = await _infoBoardFlujo.Obtener(id);
            return CreatedAtAction(nameof(Obtener), new { id }, creado);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Editar([FromRoute] Guid id, [FromBody] InfoBoardItemRequest item)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            var actual = await _infoBoardFlujo.Obtener(id);
            if (actual == null)
                return NotFound();

            await _infoBoardFlujo.Editar(id, item);
            var actualizado = await _infoBoardFlujo.Obtener(id);
            return Ok(actualizado);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Eliminar([FromRoute] Guid id)
        {
            var actual = await _infoBoardFlujo.Obtener(id);
            if (actual == null)
                return NotFound();

            await _infoBoardFlujo.Eliminar(id);
            return NoContent();
        }
    }
}

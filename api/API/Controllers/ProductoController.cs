using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductoController : ControllerBase, IProductoController
    {
        private readonly IProductoFlujo _flujo;
        private readonly ILogger<ProductoController> _logger;

        public ProductoController(IProductoFlujo flujo, ILogger<ProductoController> logger)
        {
            _flujo = flujo;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Obtener()
        {
            var lista = await _flujo.Obtener();
            return Ok(lista ?? Enumerable.Empty<Producto>());
        }

        [HttpGet("{Id:guid}")]
        public async Task<IActionResult> Obtener(Guid Id)
        {
            var item = await _flujo.Obtener(Id);
            return item is null || item.ProductoId == Guid.Empty ? NotFound() : Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Agregar([FromBody] Producto body)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);
            var id = await _flujo.Agregar(body);
            var creado = await _flujo.Obtener(id);
            return CreatedAtAction(nameof(Obtener), new { Id = id }, creado);
        }

        [HttpPut("{Id:guid}")]
        public async Task<IActionResult> Editar(Guid Id, [FromBody] Producto body)
        {
            if (!await Existe(Id)) return NotFound("El producto no existe");
            await _flujo.Editar(Id, body);
            var actualizado = await _flujo.Obtener(Id);
            return Ok(actualizado);
        }

        [HttpDelete("{Id:guid}")]
        public async Task<IActionResult> Eliminar(Guid Id)
        {
            if (!await Existe(Id)) return NotFound("El producto no existe");
            await _flujo.Eliminar(Id);
            return NoContent();
        }

        private async Task<bool> Existe(Guid id)
        {
            var dto = await _flujo.Obtener(id);
            return dto is not null && dto.ProductoId != Guid.Empty;
        }
    }
}

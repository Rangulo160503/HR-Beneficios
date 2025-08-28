using Abstracciones.Modelos;
using Abstracciones.Interfaces.DA;
using Microsoft.AspNetCore.Mvc;
using Abstracciones.Interfaces.Flujo;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriaController : ControllerBase
    {
        private readonly ICategoriaFlujo _flujo;
        public CategoriaController(ICategoriaFlujo flujo) => _flujo = flujo;

        [HttpGet]
        public async Task<IActionResult> Get() =>
            Ok(await _flujo.Obtener());

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var cat = await _flujo.Obtener(id);
            return cat?.CategoriaId > 0 ? Ok(cat) : NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CategoriaRequest body)
        {
            var id = await _flujo.Agregar(body);
            return CreatedAtAction(nameof(Get), new { id }, new { categoriaId = id });
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] CategoriaRequest body)
        {
            var updatedId = await _flujo.Editar(id, body);
            return Ok(new { categoriaId = updatedId });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deletedId = await _flujo.Eliminar(id);
            return Ok(new { categoriaId = deletedId });
        }
        // GET /api/Categoria/count
        [HttpGet("count")]
        public async Task<IActionResult> Count() =>
            Ok(new { total = await _flujo.Contar() });

    }
}

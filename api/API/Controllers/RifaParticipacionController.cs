using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

namespace API.Controllers
{
    /// <summary>
    /// Registro y consulta de participaciones para la rifa.
    /// </summary>
    /// <remarks>
    /// Ejemplo de solicitud:
    /// POST /api/RifaParticipacion
    /// {
    ///   "nombre": "Ana Pérez",
    ///   "correo": "ana@example.com",
    ///   "telefono": "+50688888888",
    ///   "mensaje": "¡Quiero participar!",
    ///   "source": "web"
    /// }
    /// 
    /// Respuesta 201:
    /// {
    ///   "id": "c2e8ecab-0d7f-4f36-9fa9-3f5ff3e5c001",
    ///   "nombre": "Ana Pérez",
    ///   "correo": "ana@example.com",
    ///   "telefono": "+50688888888",
    ///   "mensaje": "¡Quiero participar!",
    ///   "source": "web",
    ///   "estado": "Nuevo",
    ///   "fechaCreacion": "2024-05-10T12:00:00Z"
    /// }
    /// </remarks>
    [Route("api/[controller]")]
    [ApiController]
    public class RifaParticipacionController : ControllerBase
    {
        private readonly IRifaParticipacionFlujo _flujo;
        private readonly ILogger<RifaParticipacionController> _logger;

        public RifaParticipacionController(IRifaParticipacionFlujo flujo, ILogger<RifaParticipacionController> logger)
        {
            _flujo = flujo;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] RifaParticipacionRequest body)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            body.Source = string.IsNullOrWhiteSpace(body.Source) ? "web" : body.Source.Trim();

            var id = await _flujo.Crear(body);
            var creado = await _flujo.Obtener(id);
            return CreatedAtAction(nameof(Obtener), new { id }, creado);
        }

        [HttpGet]
        public async Task<IActionResult> Listar([FromQuery] string? q, [FromQuery] DateTime? from, [FromQuery] DateTime? to, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? sort = null)
        {
            var (campo, dir) = ParseSort(sort);
            var filtro = new RifaParticipacionFiltro
            {
                Q = q,
                From = from,
                To = to,
                Page = page,
                PageSize = pageSize,
                SortCampo = campo,
                SortDir = dir
            };

            var result = await _flujo.Listar(filtro);
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> Obtener(Guid id)
        {
            if (id == Guid.Empty) return BadRequest("Id inválido");
            var item = await _flujo.Obtener(id);
            return item is null || item.Id == Guid.Empty ? NotFound() : Ok(item);
        }

        [HttpPut("{id:guid}/estado")]
        public async Task<IActionResult> ActualizarEstado(Guid id, [FromBody] RifaParticipacionEstadoRequest body)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);
            if (id == Guid.Empty) return BadRequest("Id inválido");
            var actualizado = await _flujo.ActualizarEstado(id, body.Estado);
            if (!actualizado) return NotFound();

            var detalle = await _flujo.Obtener(id);
            return Ok(detalle);
        }

        private static (string Campo, string Dir) ParseSort(string? sort)
        {
            if (string.IsNullOrWhiteSpace(sort)) return ("FechaCreacion", "DESC");
            var parts = sort.Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            var campo = parts.ElementAtOrDefault(0) ?? "FechaCreacion";
            var dir = parts.ElementAtOrDefault(1) ?? "DESC";
            dir = string.Equals(dir, "ASC", StringComparison.OrdinalIgnoreCase) ? "ASC" : "DESC";

            var permitidos = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "Nombre", "Correo", "FechaCreacion", "Estado" };
            if (!permitidos.Contains(campo)) campo = "FechaCreacion";

            return (campo, dir);
        }
    }
}

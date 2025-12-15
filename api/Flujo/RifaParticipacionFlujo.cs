using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using System;

namespace Flujo
{
    public class RifaParticipacionFlujo : IRifaParticipacionFlujo
    {
        private static readonly HashSet<string> CamposOrden = new(StringComparer.OrdinalIgnoreCase)
        {
            "Nombre", "Correo", "FechaCreacion", "Estado"
        };

        private readonly IRifaParticipacionDA _rifaParticipacionDA;

        public RifaParticipacionFlujo(IRifaParticipacionDA rifaParticipacionDA)
        {
            _rifaParticipacionDA = rifaParticipacionDA ?? throw new ArgumentNullException(nameof(rifaParticipacionDA));
        }

        public async Task<Guid> Crear(RifaParticipacionRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Source))
            {
                request.Source = "web";
            }

            request.Nombre = request.Nombre.Trim();
            request.Correo = request.Correo.Trim();
            request.Telefono = string.IsNullOrWhiteSpace(request.Telefono) ? null : request.Telefono.Trim();
            request.Mensaje = string.IsNullOrWhiteSpace(request.Mensaje) ? null : request.Mensaje.Trim();

            return await _rifaParticipacionDA.Crear(request);
        }

        public async Task<RifaParticipacionResponse?> Obtener(Guid id)
        {
            return await _rifaParticipacionDA.Obtener(id);
        }

        public async Task<PagedResult<RifaParticipacionResponse>> Listar(RifaParticipacionFiltro filtro)
        {
            filtro ??= new RifaParticipacionFiltro();

            filtro.Page = Math.Max(1, filtro.Page);
            filtro.PageSize = Math.Clamp(filtro.PageSize, 1, 100);
            filtro.SortCampo = CamposOrden.Contains(filtro.SortCampo) ? filtro.SortCampo : "FechaCreacion";
            filtro.SortDir = string.Equals(filtro.SortDir, "ASC", StringComparison.OrdinalIgnoreCase) ? "ASC" : "DESC";

            var filas = await _rifaParticipacionDA.Listar(filtro);
            var total = filas.FirstOrDefault()?.TotalFiltrado ?? 0;
            var items = filas.Select(r => new RifaParticipacionResponse
            {
                Id = r.Id,
                Nombre = r.Nombre,
                Correo = r.Correo,
                Telefono = r.Telefono,
                Mensaje = r.Mensaje,
                Source = r.Source,
                Estado = r.Estado,
                FechaCreacion = r.FechaCreacion
            });

            return new PagedResult<RifaParticipacionResponse>
            {
                Items = items,
                Page = filtro.Page,
                PageSize = filtro.PageSize,
                Total = total
            };
        }

        public async Task<bool> ActualizarEstado(Guid id, string estado)
        {
            return await _rifaParticipacionDA.ActualizarEstado(id, estado);
        }
    }
}

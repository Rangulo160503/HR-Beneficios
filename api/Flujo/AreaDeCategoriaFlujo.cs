using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Flujo
{
    public class AreaDeCategoriaFlujo : IAreaDeCategoriaFlujo
    {
        private readonly IAreaDeCategoriaDA _areaDA;

        public AreaDeCategoriaFlujo(IAreaDeCategoriaDA areaDA)
        {
            _areaDA = areaDA ?? throw new ArgumentNullException(nameof(areaDA));
        }

        public async Task<Guid> Agregar(AreaDeCategoriaRequest areacategoria)
        {
            if (areacategoria is null) throw new ArgumentNullException(nameof(areacategoria));
            if (string.IsNullOrWhiteSpace(areacategoria.Nombre))
                throw new ArgumentException("El nombre es requerido.", nameof(areacategoria.Nombre));

            return await _areaDA.Agregar(areacategoria);
        }

        public async Task<Guid> Editar(Guid Id, AreaDeCategoriaRequest areacategoria)
        {
            if (Id == Guid.Empty) throw new ArgumentException("Id inválido.", nameof(Id));
            if (areacategoria is null) throw new ArgumentNullException(nameof(areacategoria));
            if (string.IsNullOrWhiteSpace(areacategoria.Nombre))
                throw new ArgumentException("El nombre es requerido.", nameof(areacategoria.Nombre));

            return await _areaDA.Editar(Id, areacategoria);
        }

        public async Task<Guid> Eliminar(Guid Id)
        {
            if (Id == Guid.Empty) throw new ArgumentException("Id inválido.", nameof(Id));
            return await _areaDA.Eliminar(Id);
        }

        public async Task<IEnumerable<AreaDeCategoriaResponse>> Obtener()
            => await _areaDA.Obtener();

        public async Task<AreaDeCategoriaDetalle> Obtener(Guid Id)
        {
            if (Id == Guid.Empty) throw new ArgumentException("Id inválido.", nameof(Id));
            var dto = await _areaDA.Obtener(Id);
            // Si tu DA devuelve un objeto vacío cuando no encuentra, lo retornamos tal cual.
            // Si prefieres null, cambia la firma de la interfaz (no recomendado porque ya acordamos Detalle).
            return dto;
        }
    }
}
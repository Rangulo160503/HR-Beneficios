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
    public class UbicacionFlujo : IUbicacionFlujo
    {
        private readonly IUbicacionDA _ubicacionDA;

        public UbicacionFlujo(IUbicacionDA ubicacionDA)
        {
            _ubicacionDA = ubicacionDA ?? throw new ArgumentNullException(nameof(ubicacionDA));
        }

        public async Task<IEnumerable<Ubicacion>> Obtener()
        {
            var items = await _ubicacionDA.Obtener();
            return items;
        }

        public async Task<Ubicacion?> Obtener(Guid id)
        {
            var item = await _ubicacionDA.Obtener(id);
            return item ?? new Ubicacion();
        }

        public async Task<Guid> Agregar(Ubicacion ubicacion)
        {
            var id = await _ubicacionDA.Agregar(ubicacion);
            return id;
        }

        public async Task<Guid> Editar(Guid id, Ubicacion ubicacion)
        {
            var result = await _ubicacionDA.Editar(id, ubicacion);
            return result;
        }

        public async Task<Guid> Eliminar(Guid id)
        {
            var result = await _ubicacionDA.Eliminar(id);
            return result;
        }
    }
}

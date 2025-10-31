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
    public class ServicioFlujo : IServicioFlujo
    {
        private readonly IServicioDA _servicioDA;

        public ServicioFlujo(IServicioDA servicioDA)
        {
            _servicioDA = servicioDA ?? throw new ArgumentNullException(nameof(servicioDA));
        }

        public async Task<IEnumerable<Servicio>> Obtener()
        {
            var items = await _servicioDA.Obtener();
            return items;
        }

        public async Task<Servicio?> Obtener(Guid id)
        {
            var item = await _servicioDA.Obtener(id);
            return item ?? new Servicio();
        }

        public async Task<Guid> Agregar(Servicio servicio)
        {
            var newId = await _servicioDA.Agregar(servicio);
            return newId;
        }

        public async Task<Guid> Editar(Guid id, Servicio servicio)
        {
            var result = await _servicioDA.Editar(id, servicio);
            return result;
        }

        public async Task<Guid> Eliminar(Guid id)
        {
            var result = await _servicioDA.Eliminar(id);
            return result;
        }
    }
}

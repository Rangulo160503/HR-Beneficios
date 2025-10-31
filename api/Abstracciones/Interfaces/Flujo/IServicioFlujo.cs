using Abstracciones.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.Flujo
{
    public interface IServicioFlujo
    {
        Task<IEnumerable<Servicio>> Obtener();
        Task<Servicio?> Obtener(Guid id);
        Task<Guid> Agregar(Servicio servicio);
        Task<Guid> Editar(Guid id, Servicio servicio);
        Task<Guid> Eliminar(Guid id);
    }
}

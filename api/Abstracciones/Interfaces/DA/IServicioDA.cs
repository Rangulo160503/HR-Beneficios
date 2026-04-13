using Abstracciones.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.DA
{
    public interface IServicioDA
    {
        Task<IEnumerable<Servicio>> Obtener();
        Task<Servicio> Obtener(Guid Id);
        Task<Guid> Agregar(Servicio servicio);
        Task<Guid> Editar(Guid Id, Servicio servicio);
        Task<Guid> Eliminar(Guid Id);
    }
}

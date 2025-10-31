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
        Task<IEnumerable<Servicio>> Obtener();          // core.ObtenerServicios
        Task<Servicio> Obtener(Guid Id);                // core.ObtenerServicio
        Task<Guid> Agregar(Servicio servicio);          // core.Servicio_Insertar
        Task<Guid> Editar(Guid Id, Servicio servicio);  // core.Servicio_Actualizar
        Task<Guid> Eliminar(Guid Id);                   // core.Servicio_Eliminar
    }
}

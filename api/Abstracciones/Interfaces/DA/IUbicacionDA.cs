using Abstracciones.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.DA
{
    public interface IUbicacionDA
    {
        Task<IEnumerable<Ubicacion>> Obtener();          // core.ObtenerUbicaciones
        Task<Ubicacion> Obtener(Guid Id);                // core.ObtenerUbicacion
        Task<Guid> Agregar(Ubicacion ubicacion);         // core.Ubicacion_Insertar
        Task<Guid> Editar(Guid Id, Ubicacion ubicacion); // core.Ubicacion_Actualizar
        Task<Guid> Eliminar(Guid Id);                    // core.Ubicacion_Eliminar
    }
}

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
        Task<IEnumerable<Ubicacion>> Obtener();
        Task<Ubicacion> Obtener(Guid Id);
        Task<Guid> Agregar(Ubicacion ubicacion);
        Task<Guid> Editar(Guid Id, Ubicacion ubicacion);
        Task<Guid> Eliminar(Guid Id);
    }
}

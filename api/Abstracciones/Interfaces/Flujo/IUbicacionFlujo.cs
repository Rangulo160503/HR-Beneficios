using Abstracciones.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.Flujo
{
    public interface IUbicacionFlujo
    {
        Task<IEnumerable<Ubicacion>> Obtener();
        Task<Ubicacion?> Obtener(Guid id);
        Task<Guid> Agregar(Ubicacion ubicacion);
        Task<Guid> Editar(Guid id, Ubicacion ubicacion);
        Task<Guid> Eliminar(Guid id);
    }
}

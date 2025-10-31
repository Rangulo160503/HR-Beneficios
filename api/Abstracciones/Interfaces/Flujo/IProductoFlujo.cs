using Abstracciones.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.Flujo
{
    public interface IProductoFlujo
    {
        Task<IEnumerable<Producto>> Obtener();
        Task<Producto?> Obtener(Guid id);
        Task<Guid> Agregar(Producto producto);
        Task<Guid> Editar(Guid id, Producto producto);
        Task<Guid> Eliminar(Guid id);
    }
}

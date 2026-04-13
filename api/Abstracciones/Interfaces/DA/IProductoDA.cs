using Abstracciones.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.DA
{
    public interface IProductoDA
    {
        Task<IEnumerable<Producto>> Obtener();
        Task<Producto> Obtener(Guid Id);
        Task<Guid> Agregar(Producto producto);
        Task<Guid> Editar(Guid Id, Producto producto);
        Task<Guid> Eliminar(Guid Id);
    }
}

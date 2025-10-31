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
        Task<IEnumerable<Producto>> Obtener();          // core.ObtenerProductos
        Task<Producto> Obtener(Guid Id);                // core.ObtenerProducto
        Task<Guid> Agregar(Producto producto);          // core.Producto_Insertar
        Task<Guid> Editar(Guid Id, Producto producto);  // core.Producto_Actualizar
        Task<Guid> Eliminar(Guid Id);                   // core.Producto_Eliminar
    }
}

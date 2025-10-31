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
    public class ProductoFlujo : IProductoFlujo
    {
        private readonly IProductoDA _productoDA;

        public ProductoFlujo(IProductoDA productoDA)
        {
            _productoDA = productoDA ?? throw new ArgumentNullException(nameof(productoDA));
        }

        public async Task<IEnumerable<Producto>> Obtener()
        {
            var items = await _productoDA.Obtener();
            return items;
        }

        public async Task<Producto?> Obtener(Guid id)
        {
            var item = await _productoDA.Obtener(id);
            return item ?? new Producto();
        }

        public async Task<Guid> Agregar(Producto producto)
        {
            var id = await _productoDA.Agregar(producto);
            return id;
        }

        public async Task<Guid> Editar(Guid id, Producto producto)
        {
            var result = await _productoDA.Editar(id, producto);
            return result;
        }

        public async Task<Guid> Eliminar(Guid id)
        {
            var result = await _productoDA.Eliminar(id);
            return result;
        }
    }
}

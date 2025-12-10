using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;

namespace Flujo
{
    public class ProveedorFlujo : IProveedorFlujo
    {
        private readonly IProveedorDA _proveedorDA;

        public ProveedorFlujo(IProveedorDA proveedorDA)
        {
            _proveedorDA = proveedorDA ?? throw new ArgumentNullException(nameof(proveedorDA));
        }

        public async Task<Guid> Agregar(ProveedorRequest proveedor)
        {
            var id = await _proveedorDA.Agregar(proveedor);
            return id;
        }

        public async Task<Guid> Editar(Guid id, ProveedorRequest proveedor)
        {
            var result = await _proveedorDA.Editar(id, proveedor);
            return result;
        }

        public async Task<Guid> Eliminar(Guid id)
        {
            var result = await _proveedorDA.Eliminar(id);
            return result;
        }

        public async Task<IEnumerable<ProveedorResponse>> Obtener()
        {
            var items = await _proveedorDA.Obtener();
            return items;
        }

        public async Task<ProveedorDetalle> Obtener(Guid id)
        {
            var proveedor = await _proveedorDA.Obtener(id);
            return proveedor;
        }
        public async Task<bool> ExisteProveedor(Guid id)
        {
            var existe = await _proveedorDA.ExisteProveedor(id);
            return existe;
        }
    }
}

using Abstracciones.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.Flujo
{
    public interface IProveedorFlujo
    {
        Task<IEnumerable<ProveedorResponse>> Obtener();
        Task<ProveedorDetalle> Obtener(Guid Id);
        Task<Guid> Agregar(ProveedorRequest proveedor);
        Task<Guid> Editar(Guid Id, ProveedorRequest proveedor);
        Task<Guid> Eliminar(Guid Id);
        Task<bool> ExisteProveedor(Guid id);
        Task<ProveedorDetalle?> ObtenerPorToken(string token);
        Task<ProveedorLoginResponse> LoginPorToken(ProveedorLoginRequest request);
        Task<ProveedorSesionResponse?> ValidarSesionProveedor(Guid proveedorId);
    }
}

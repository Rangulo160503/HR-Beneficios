using Abstracciones.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.Flujo
{
    public interface IUsuarioFlujo
    {
        // CRUD
        Task<IEnumerable<UsuarioResponse>> Obtener();
        Task<UsuarioResponse?> Obtener(Guid id);
        Task<Guid> Agregar(UsuarioRequest usuario);
        Task<Guid> Editar(Guid id, UsuarioRequest usuario);
        Task<Guid> Eliminar(Guid id);

        // Vínculo con proveedor
        Task<Guid> AsignarProveedor(Guid usuarioId, Guid proveedorId);
        Task<Guid> QuitarProveedor(Guid usuarioId);
    }
}

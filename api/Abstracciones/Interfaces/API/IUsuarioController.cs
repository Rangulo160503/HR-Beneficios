using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.API
{
    public interface IUsuarioController
    {
        // CRUD básico
        Task<IEnumerable<UsuarioResponse>> Obtener();
        Task<UsuarioResponse?> Obtener(Guid id);
        Task<Guid> Agregar(UsuarioRequest usuario);
        Task<Guid> Editar(Guid id, UsuarioRequest usuario);
        Task<Guid> Eliminar(Guid id);

        // Gestión de proveedor del usuario
        Task<Guid> AsignarProveedor(Guid usuarioId, Guid proveedorId);
        Task<Guid> QuitarProveedor(Guid usuarioId);
    }
}

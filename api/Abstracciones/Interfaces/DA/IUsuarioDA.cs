using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.DA
{
    public interface IUsuarioDA
    {
        Task<IEnumerable<UsuarioResponse>> Obtener();
        Task<UsuarioResponse?> Obtener(Guid id);
        Task<Guid> Agregar(UsuarioRequest req);
        Task<Guid> Editar(Guid id, UsuarioRequest req);
        Task<Guid> Eliminar(Guid id);

        Task<Guid> AsignarProveedor(Guid usuarioId, Guid proveedorId);
        Task<Guid> QuitarProveedor(Guid usuarioId);
    }
}

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
    public class UsuarioFlujo : IUsuarioFlujo
    {
        private readonly IUsuarioDA _usuarioDA;

        public UsuarioFlujo(IUsuarioDA usuarioDA)
        {
            _usuarioDA = usuarioDA ?? throw new ArgumentNullException(nameof(usuarioDA));
        }

        #region CRUD
        public async Task<Guid> Agregar(UsuarioRequest usuario)
        {
            var id = await _usuarioDA.Agregar(usuario);
            return id;
        }

        public async Task<Guid> Editar(Guid id, UsuarioRequest usuario)
        {
            var result = await _usuarioDA.Editar(id, usuario);
            return result;
        }

        public async Task<Guid> Eliminar(Guid id)
        {
            var result = await _usuarioDA.Eliminar(id);
            return result;
        }

        public async Task<IEnumerable<UsuarioResponse>> Obtener()
        {
            var usuarios = await _usuarioDA.Obtener();
            return usuarios;
        }

        public async Task<UsuarioResponse?> Obtener(Guid id)
        {
            var usuario = await _usuarioDA.Obtener(id);
            return usuario;
        }
        #endregion

        #region Gestión de proveedor
        public async Task<Guid> AsignarProveedor(Guid usuarioId, Guid proveedorId)
        {
            var result = await _usuarioDA.AsignarProveedor(usuarioId, proveedorId);
            return result;
        }

        public async Task<Guid> QuitarProveedor(Guid usuarioId)
        {
            var result = await _usuarioDA.QuitarProveedor(usuarioId);
            return result;
        }
        #endregion
    }
}

using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DA
{
    public class UsuarioDA : IUsuarioDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly IDbConnection _dbConnection;
        private readonly IDapperWrapper _dapperWrapper;

        public UsuarioDA(IRepositorioDapper repositorioDapper, IDapperWrapper dapperWrapper)
        {
            _repositorioDapper = repositorioDapper ?? throw new ArgumentNullException(nameof(repositorioDapper));
            _dapperWrapper = dapperWrapper ?? throw new ArgumentNullException(nameof(dapperWrapper));
            _dbConnection = _repositorioDapper.ObtenerRepositorio();
        }

        #region CRUD
        public async Task<Guid> Agregar(UsuarioRequest u)
        {
            const string sp = "core.Usuario_Insertar";
            var id = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection, sp, new
                {
                    u.Correo,
                    u.Nombre,
                    u.Telefono,
                    u.PasswordHash,
                    u.ProveedorId
                },
                commandType: CommandType.StoredProcedure
            );
            return id;
        }

        public async Task<Guid> Editar(Guid id, UsuarioRequest u)
        {
            const string sp = "core.Usuario_Actualizar";
            var rid = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection, sp, new
                {
                    UsuarioId = id,
                    u.Correo,
                    u.Nombre,
                    u.Telefono,
                    u.PasswordHash
                },
                commandType: CommandType.StoredProcedure
            );
            return rid;
        }

        public async Task<Guid> Eliminar(Guid id)
        {
            await VerificarUsuarioExiste(id);
            const string sp = "core.Usuario_Eliminar";
            var rid = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection, sp, new { UsuarioId = id },
                commandType: CommandType.StoredProcedure
            );
            return rid;
        }

        public async Task<IEnumerable<UsuarioResponse>> Obtener()
        {
            const string sp = "core.Usuario_Listar";
            var rows = await _dapperWrapper.QueryAsync<UsuarioResponse>(
                _dbConnection, sp, null, null, null, CommandType.StoredProcedure
            );
            return rows;
        }

        public async Task<UsuarioResponse?> Obtener(Guid id)
        {
            const string sp = "core.Usuario_Obtener";
            var rows = await _dapperWrapper.QueryAsync<UsuarioResponse>(
                _dbConnection, sp, new { UsuarioId = id }, null, null, CommandType.StoredProcedure
            );
            return rows.FirstOrDefault();
        }
        #endregion

        #region Vínculo Proveedor
        public async Task<Guid> AsignarProveedor(Guid usuarioId, Guid proveedorId)
        {
            const string sp = "core.Usuario_AsignarProveedor";
            var rid = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection, sp, new
                {
                    UsuarioId = usuarioId,
                    ProveedorId = proveedorId
                },
                commandType: CommandType.StoredProcedure
            );
            return rid;
        }

        public async Task<Guid> QuitarProveedor(Guid usuarioId)
        {
            const string sp = "core.Usuario_QuitarProveedor";
            var rid = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection, sp, new { UsuarioId = usuarioId },
                commandType: CommandType.StoredProcedure
            );
            return rid;
        }
        #endregion

        #region Helpers
        private async Task VerificarUsuarioExiste(Guid id)
        {
            var dto = await Obtener(id);
            if (dto == null || dto.UsuarioId == Guid.Empty)
                throw new Exception("No se encontró el usuario.");
        }
        #endregion
    }
}

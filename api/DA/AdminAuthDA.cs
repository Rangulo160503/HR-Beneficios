using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using System.Data;

namespace DA
{
    public class AdminAuthDA : IAdminAuthDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly IDapperWrapper _dapperWrapper;
        private readonly IDbConnection _dbConnection;

        public AdminAuthDA(IRepositorioDapper repositorioDapper, IDapperWrapper dapperWrapper)
        {
            _repositorioDapper = repositorioDapper ?? throw new ArgumentNullException(nameof(repositorioDapper));
            _dapperWrapper = dapperWrapper ?? throw new ArgumentNullException(nameof(dapperWrapper));
            _dbConnection = _repositorioDapper.ObtenerRepositorio();
        }

        public async Task<AdminUsuario?> ObtenerPorUsuario(string usuario)
        {
            const string sp = "core.AdminUsuario_Login";
            var admin = await _dapperWrapper.QueryFirstOrDefaultAsync<AdminUsuario>(
                _dbConnection,
                sp,
                new { Usuario = usuario },
                commandType: CommandType.StoredProcedure
            );
            return admin;
        }

        public async Task<Guid> Crear(AdminUsuario adminUsuario)
        {
            const string sp = "core.AdminUsuario_Crear";
            var id = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection,
                sp,
                new
                {
                    adminUsuario.Usuario,
                    adminUsuario.Nombre,
                    adminUsuario.Correo,
                    adminUsuario.PasswordHash,
                    adminUsuario.Activo
                },
                commandType: CommandType.StoredProcedure
            );
            return id;
        }

        public async Task<int> ActualizarUltimoLogin(Guid adminUsuarioId)
        {
            const string sp = "core.AdminUsuario_ActualizarUltimoLogin";
            var rows = await _dapperWrapper.ExecuteAsync(
                _dbConnection,
                sp,
                new { AdminUsuarioId = adminUsuarioId },
                commandType: CommandType.StoredProcedure
            );
            return rows;
        }
    }
}

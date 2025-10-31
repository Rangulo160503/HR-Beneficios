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
    public class UbicacionDA : IUbicacionDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly IDbConnection _dbConnection;
        private readonly IDapperWrapper _dapperWrapper;

        public UbicacionDA(IRepositorioDapper repositorioDapper, IDapperWrapper dapperWrapper)
        {
            _repositorioDapper = repositorioDapper ?? throw new ArgumentNullException(nameof(repositorioDapper));
            _dapperWrapper = dapperWrapper ?? throw new ArgumentNullException(nameof(dapperWrapper));
            _dbConnection = _repositorioDapper.ObtenerRepositorio();
        }

        #region Operaciones
        public async Task<IEnumerable<Ubicacion>> Obtener()
        {
            const string sp = "core.ObtenerUbicaciones";
            return await _dapperWrapper.QueryAsync<Ubicacion>(_dbConnection, sp,
                commandType: CommandType.StoredProcedure);
        }

        public async Task<Ubicacion> Obtener(Guid Id)
        {
            const string sp = "core.ObtenerUbicacion";
            var rows = await _dapperWrapper.QueryAsync<Ubicacion>(_dbConnection, sp, new { UbicacionId = Id },
                commandType: CommandType.StoredProcedure);
            return rows.FirstOrDefault() ?? new Ubicacion();
        }

        public async Task<Guid> Agregar(Ubicacion u)
        {
            const string sp = "core.Ubicacion_Insertar";
            var id = await _dapperWrapper.ExecuteScalarAsync<Guid>(_dbConnection, sp, new
            {
                u.Provincia,
                u.Canton,
                u.Distrito,
                u.DireccionExacta
            }, commandType: CommandType.StoredProcedure);
            return id;
        }

        public async Task<Guid> Editar(Guid Id, Ubicacion u)
        {
            const string sp = "core.Ubicacion_Actualizar";
            var rid = await _dapperWrapper.ExecuteScalarAsync<Guid>(_dbConnection, sp, new
            {
                Id,
                u.Provincia,
                u.Canton,
                u.Distrito,
                u.DireccionExacta
            }, commandType: CommandType.StoredProcedure);
            return rid;
        }

        public async Task<Guid> Eliminar(Guid Id)
        {
            await VerificarExiste(Id);
            const string sp = "core.Ubicacion_Eliminar";
            var rid = await _dapperWrapper.ExecuteScalarAsync<Guid>(_dbConnection, sp, new { Id },
                commandType: CommandType.StoredProcedure);
            return rid;
        }
        #endregion

        #region Helpers
        private async Task VerificarExiste(Guid id)
        {
            var dto = await Obtener(id);
            if (dto == null || dto.UbicacionId == Guid.Empty)
                throw new Exception("No se encontró la ubicación.");
        }
        #endregion
    }
}

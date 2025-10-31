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
    public class ServicioDA : IServicioDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly IDbConnection _dbConnection;
        private readonly IDapperWrapper _dapperWrapper;

        public ServicioDA(IRepositorioDapper repositorioDapper, IDapperWrapper dapperWrapper)
        {
            _repositorioDapper = repositorioDapper ?? throw new ArgumentNullException(nameof(repositorioDapper));
            _dapperWrapper = dapperWrapper ?? throw new ArgumentNullException(nameof(dapperWrapper));
            _dbConnection = _repositorioDapper.ObtenerRepositorio();
        }

        #region Operaciones
        public async Task<IEnumerable<Servicio>> Obtener()
        {
            const string sp = "core.ObtenerServicios";
            return await _dapperWrapper.QueryAsync<Servicio>(_dbConnection, sp,
                commandType: CommandType.StoredProcedure);
        }

        public async Task<Servicio> Obtener(Guid Id)
        {
            const string sp = "core.ObtenerServicio";
            var rows = await _dapperWrapper.QueryAsync<Servicio>(_dbConnection, sp, new { ServicioId = Id },
                commandType: CommandType.StoredProcedure);
            return rows.FirstOrDefault() ?? new Servicio();
        }

        public async Task<Guid> Agregar(Servicio s)
        {
            const string sp = "core.Servicio_Insertar";
            var id = await _dapperWrapper.ExecuteScalarAsync<Guid>(_dbConnection, sp, new
            {
                s.Nombre,
                s.Descripcion
            }, commandType: CommandType.StoredProcedure);
            return id;
        }

        public async Task<Guid> Editar(Guid Id, Servicio s)
        {
            const string sp = "core.Servicio_Actualizar";
            var rid = await _dapperWrapper.ExecuteScalarAsync<Guid>(_dbConnection, sp, new
            {
                Id,
                s.Nombre,
                s.Descripcion
            }, commandType: CommandType.StoredProcedure);
            return rid;
        }

        public async Task<Guid> Eliminar(Guid Id)
        {
            await VerificarExiste(Id);
            const string sp = "core.Servicio_Eliminar";
            var rid = await _dapperWrapper.ExecuteScalarAsync<Guid>(_dbConnection, sp, new { Id },
                commandType: CommandType.StoredProcedure);
            return rid;
        }
        #endregion

        #region Helpers
        private async Task VerificarExiste(Guid id)
        {
            var dto = await Obtener(id);
            if (dto == null || dto.ServicioId == Guid.Empty)
                throw new Exception("No se encontró el servicio.");
        }
        #endregion
    }
}

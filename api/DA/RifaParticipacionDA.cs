using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using System;
using System.Data;
using System.Linq;

namespace DA
{
    public class RifaParticipacionDA : IRifaParticipacionDA
    {
        private readonly IDbConnection _dbConnection;
        private readonly IDapperWrapper _dapperWrapper;

        public RifaParticipacionDA(IRepositorioDapper repositorioDapper, IDapperWrapper dapperWrapper)
        {
            _dbConnection = repositorioDapper.ObtenerRepositorio();
            _dapperWrapper = dapperWrapper;
        }

        public async Task<Guid> Crear(RifaParticipacionRequest request)
        {
            const string sp = "core.RifaParticipacion_Insertar";
            return await _dapperWrapper.ExecuteScalarAsync<Guid>(_dbConnection, sp, new
            {
                request.Nombre,
                request.Correo,
                request.Telefono,
                request.Mensaje,
                request.Source
            }, commandType: CommandType.StoredProcedure);
        }

        public async Task<RifaParticipacionResponse?> Obtener(Guid id)
        {
            const string sp = "core.RifaParticipacion_ObtenerPorId";
            return await _dapperWrapper.QueryFirstOrDefaultAsync<RifaParticipacionResponse>(_dbConnection, sp, new { Id = id }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<RifaParticipacionListado>> Listar(RifaParticipacionFiltro filtro)
        {
            const string sp = "core.RifaParticipacion_Listar";
            return await _dapperWrapper.QueryAsync<RifaParticipacionListado>(_dbConnection, sp, new
            {
                filtro.Q,
                filtro.From,
                filtro.To,
                filtro.Page,
                filtro.PageSize,
                filtro.SortCampo,
                filtro.SortDir
            }, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> ActualizarEstado(Guid id, string estado)
        {
            const string sp = "core.RifaParticipacion_ActualizarEstado";
            var affected = await _dapperWrapper.ExecuteAsync(_dbConnection, sp, new { Id = id, Estado = estado }, commandType: CommandType.StoredProcedure);
            return affected > 0;
        }
    }
}

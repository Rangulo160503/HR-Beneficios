using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using System.Data;
using System.Linq;

namespace DA
{
    public class InfoBoardDA : IInfoBoardDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly IDapperWrapper _dapperWrapper;
        private readonly IDbConnection _dbConnection;

        public InfoBoardDA(IRepositorioDapper repositorioDapper, IDapperWrapper dapperWrapper)
        {
            _repositorioDapper = repositorioDapper ?? throw new ArgumentNullException(nameof(repositorioDapper));
            _dapperWrapper = dapperWrapper ?? throw new ArgumentNullException(nameof(dapperWrapper));
            _dbConnection = _repositorioDapper.ObtenerRepositorio();
        }

        public async Task<Guid> Agregar(InfoBoardItemRequest item)
        {
            const string sp = "core.InfoBoardItem_Agregar";
            var id = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection,
                sp,
                new
                {
                    item.Titulo,
                    item.Descripcion,
                    item.Url,
                    item.Tipo,
                    item.Prioridad,
                    item.Activo,
                    item.FechaInicio,
                    item.FechaFin
                },
                null,
                null,
                CommandType.StoredProcedure
            );

            return id;
        }

        public async Task<Guid> Editar(Guid id, InfoBoardItemRequest item)
        {
            await VerificarExiste(id);

            const string sp = "core.InfoBoardItem_Editar";
            var resultado = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection,
                sp,
                new
                {
                    InfoBoardItemId = id,
                    item.Titulo,
                    item.Descripcion,
                    item.Url,
                    item.Tipo,
                    item.Prioridad,
                    item.Activo,
                    item.FechaInicio,
                    item.FechaFin
                },
                null,
                null,
                CommandType.StoredProcedure
            );

            return resultado;
        }

        public async Task<Guid> Eliminar(Guid id)
        {
            await VerificarExiste(id);

            const string sp = "core.InfoBoardItem_Eliminar";
            var resultado = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection,
                sp,
                new { InfoBoardItemId = id },
                null,
                null,
                CommandType.StoredProcedure
            );

            return resultado;
        }

        public async Task<IEnumerable<InfoBoardItemResponse>> Obtener(bool? activo, string? busqueda)
        {
            const string sp = "core.InfoBoardItem_Listar";
            var rows = await _dapperWrapper.QueryAsync<InfoBoardItemResponse>(
                _dbConnection,
                sp,
                new { Activo = activo, Busqueda = busqueda },
                null,
                null,
                CommandType.StoredProcedure
            );

            return rows;
        }

        public async Task<InfoBoardItemResponse?> Obtener(Guid id)
        {
            const string sp = "core.InfoBoardItem_ObtenerPorId";
            var rows = await _dapperWrapper.QueryAsync<InfoBoardItemResponse>(
                _dbConnection,
                sp,
                new { InfoBoardItemId = id },
                null,
                null,
                CommandType.StoredProcedure
            );

            return rows.FirstOrDefault();
        }

        private async Task VerificarExiste(Guid id)
        {
            var item = await Obtener(id);
            if (item == null)
                throw new Exception("No se encontro el item de pizarra");
        }
    }
}

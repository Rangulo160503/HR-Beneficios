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
    public class AreaDeCategoriaDA : IAreaDeCategoriaDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly IDbConnection _dbConnection;
        private readonly IDapperWrapper _dapperWrapper;

        public AreaDeCategoriaDA(IRepositorioDapper repositorioDapper, IDapperWrapper dapperWrapper)
        {
            _repositorioDapper = repositorioDapper ?? throw new ArgumentNullException(nameof(repositorioDapper));
            _dapperWrapper = dapperWrapper ?? throw new ArgumentNullException(nameof(dapperWrapper));
            _dbConnection = _repositorioDapper.ObtenerRepositorio();
        }

        #region Operaciones (CRUD)

        public async Task<Guid> Agregar(AreaDeCategoriaRequest a)
        {
            const string sp = "core.AreaDeCategoria_Agregar";
            var id = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection, sp,
                new { Nombre = a.Nombre },
                null, null, CommandType.StoredProcedure
            );
            return id;
        }

        public async Task<Guid> Editar(Guid id, AreaDeCategoriaRequest a)
        {
            const string sp = "core.AreaDeCategoria_Editar";
            await VerificarExiste(id);

            var rid = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection, sp,
                new { AreaDeCategoriaId = id, Nombre = a.Nombre },
                commandType: CommandType.StoredProcedure
            );

            return rid == Guid.Empty ? id : rid;
        }

        public async Task<Guid> Eliminar(Guid id)
        {
            await VerificarExiste(id);

            const string sp = "core.AreaDeCategoria_Eliminar";
            var rid = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection, sp, new { AreaDeCategoriaId = id },
                null, null, CommandType.StoredProcedure
            );

            return rid == Guid.Empty ? id : rid;
        }

        public async Task<IEnumerable<AreaDeCategoriaResponse>> Obtener()
        {
            const string sp = "core.AreaDeCategoria_Listar";
            var rows = await _dapperWrapper.QueryAsync<AreaDeCategoriaResponse>(
                _dbConnection, sp,
                new { Buscar = (string?)null, Page = 1, PageSize = 1000 },
                null, null, CommandType.StoredProcedure
            );
            return rows;
        }

        public async Task<AreaDeCategoriaDetalle> Obtener(Guid Id)
        {
            const string sp = "core.AreaDeCategoria_ObtenerPorId";

            var rows = await _dapperWrapper.QueryAsync<AreaDeCategoriaDetalle>(
                _dbConnection, sp, new { AreaDeCategoriaId = Id },
                null, null, CommandType.StoredProcedure
            );

            return rows.FirstOrDefault() ?? new AreaDeCategoriaDetalle();
        }

        #endregion

        #region Helpers

        private async Task VerificarExiste(Guid id)
        {
            var dto = await Obtener(id);
            if (dto == null || dto.AreaDeCategoriaId == Guid.Empty)
                throw new Exception("No se encontró el área de categoría.");
        }

        #endregion
    }
}

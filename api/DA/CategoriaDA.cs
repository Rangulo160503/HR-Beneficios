using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using System.Data;
using System.Linq;

namespace DA
{
    public class CategoriaDA : ICategoriaDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly IDbConnection _dbConnection;
        private readonly IDapperWrapper _dapperWrapper;

        public CategoriaDA(IRepositorioDapper repositorioDapper, IDapperWrapper dapperWrapper)
        {
            _repositorioDapper = repositorioDapper ?? throw new ArgumentNullException(nameof(repositorioDapper));
            _dapperWrapper = dapperWrapper ?? throw new ArgumentNullException(nameof(dapperWrapper));
            _dbConnection = _repositorioDapper.ObtenerRepositorio();
        }

        #region Operaciones
        public async Task<Guid> Agregar(CategoriaRequest categoria)
        {
            const string sp = "core.AgregarCategoria";
            var id = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection, sp, new
                {
                    Nombre = categoria.Nombre,
                    Activa = categoria.Activa
                },
                null, null, CommandType.StoredProcedure
            );
            return id;
        }

        public async Task<Guid> Editar(Guid Id, CategoriaRequest categoria)
        {
            await verficarCategoriaExiste(Id);
            const string sp = "core.EditarCategoria";
            var id = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection, sp, new
                {
                    Id,
                    Nombre = categoria.Nombre,
                    Activa = categoria.Activa
                },
                null, null, CommandType.StoredProcedure
            );
            return id;
        }

        public async Task<Guid> Eliminar(Guid Id)
        {
            await verficarCategoriaExiste(Id);
            const string sp = "core.EliminarCategoria";
            var id = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection, sp, new { Id },
                null, null, CommandType.StoredProcedure
            );
            return id;
        }

        public async Task<IEnumerable<CategoriaResponse>> Obtener()
        {
            const string sp = "core.ObtenerCategorias";
            var rows = await _dapperWrapper.QueryAsync<CategoriaResponse>(
                _dbConnection, sp, null, null, null, CommandType.StoredProcedure
            );
            return rows;
        }

        public async Task<CategoriaDetalle> Obtener(Guid Id)
        {
            const string sp = "core.ObtenerCategoria";
            var rows = await _dapperWrapper.QueryAsync<CategoriaDetalle>(
                _dbConnection, sp, new { Id }, null, null, CommandType.StoredProcedure
            );
            return rows.FirstOrDefault() ?? new CategoriaDetalle();
        }
        #endregion

        #region Helpers
        private async Task verficarCategoriaExiste(Guid Id)
        {
            var dto = await Obtener(Id);
            if (dto == null || dto.CategoriaId == Guid.Empty)
                throw new Exception("No se encontro la categoria");
        }
        #endregion
    }
}

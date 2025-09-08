using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using System.Data;
using System.Linq;

namespace DA
{
    public class CategoriaDA : ICategoriaDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly IDapperWrapper _dapperWrapper;
        private readonly IDbConnection _dbConnection;

        public CategoriaDA(IRepositorioDapper repositorioDapper, IDapperWrapper dapperWrapper)
        {
            _repositorioDapper = repositorioDapper ?? throw new ArgumentNullException(nameof(repositorioDapper));
            _dapperWrapper = dapperWrapper ?? throw new ArgumentNullException(nameof(dapperWrapper));
            _dbConnection = _repositorioDapper.ObtenerRepositorio();
        }

        public async Task<IEnumerable<CategoriaResponse>> Obtener()
        {
            const string sp = @"core.ObtenerCategorias";
            var rows = await _dapperWrapper.QueryAsync<CategoriaResponse>(_dbConnection, sp);
            return rows;
        }

        public async Task<CategoriaDetalle> Obtener(Guid id)
        {
            const string sp = @"core.ObtenerCategoria";
            var rows = await _dapperWrapper.QueryAsync<CategoriaDetalle>(_dbConnection, sp, new { Id = id });
            return rows.FirstOrDefault() ?? new CategoriaDetalle();
        }

        public async Task<Guid> Agregar(CategoriaRequest categoria)
        {
            const string sp = @"core.AgregarCategoria";
            var result = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection, sp, new
                {
                    categoria.Nombre,
                    categoria.Activa
                });
            return result;
        }

        public async Task<Guid> Editar(Guid id, CategoriaRequest categoria)
        {
            const string sp = @"core.EditarCategoria";
            var result = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection, sp, new
                {
                    Id = id,
                    categoria.Nombre,
                    categoria.Activa
                });
            return result;
        }

        public async Task<Guid> Eliminar(Guid id)
        {
            const string sp = @"core.EliminarCategoria";
            var result = await _dapperWrapper.ExecuteScalarAsync<Guid>(_dbConnection, sp, new { Id = id });
            return result;
        }

        public async Task<int> Contar()
        {
            const string sp = @"core.ContarCategorias";
            return await _dapperWrapper.ExecuteScalarAsync<int>(_dbConnection, sp);
        }
    }
}

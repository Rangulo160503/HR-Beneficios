using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using System.Data;

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
            return await _dapperWrapper.QueryAsync<CategoriaResponse>(_dbConnection, sp);
        }

        public async Task<CategoriaResponse> Obtener(int id)
        {
            const string sp = @"core.ObtenerCategoria";
            var rows = await _dapperWrapper.QueryAsync<CategoriaResponse>(_dbConnection, sp, new { Id = id });
            return rows.FirstOrDefault() ?? new CategoriaResponse();
        }

        public async Task<int> Agregar(CategoriaRequest categoria)
        {
            const string sp = @"core.AgregarCategoria";
            return await _dapperWrapper.ExecuteScalarAsync<int>(_dbConnection, sp, new { categoria.Nombre });
        }

        public async Task<int> Editar(int id, CategoriaRequest categoria)
        {
            const string sp = @"core.EditarCategoria";
            return await _dapperWrapper.ExecuteScalarAsync<int>(_dbConnection, sp, new { Id = id, categoria.Nombre, categoria.Activa });
        }

        public async Task<int> Eliminar(int id)
        {
            const string sp = @"core.EliminarCategoria";
            return await _dapperWrapper.ExecuteScalarAsync<int>(_dbConnection, sp, new { Id = id });
        }
        public async Task<int> Contar() 
        {
            const string sp = @"core.ContarCategorias";
            return await _dapperWrapper.ExecuteScalarAsync<int>(_dbConnection, sp);
        }
    }
}

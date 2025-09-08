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
            string query = @"core.AgregarCategoria";
            var resultadoConsulta = await _dapperWrapper.ExecuteScalarAsync<Guid>(_dbConnection, query, new
            {
                categoria.Nombre,
                categoria.Activa
            });
            return resultadoConsulta;
        }

        public async Task<Guid> Editar(Guid Id, CategoriaRequest categoria)
        {
            await verificarCategoriaExiste(Id);
            string query = @"core.EditarCategoria";
            var resultadoConsulta = await _dapperWrapper.ExecuteScalarAsync<Guid>(_dbConnection, query, new
            {
                CategoriaId = Id,
                categoria.Nombre,
                categoria.Activa
            });
            return resultadoConsulta;
        }

        public async Task<Guid> Eliminar(Guid Id)
        {
            await verificarCategoriaExiste(Id);
            string query = @"core.EliminarCategoria";
            var resultadoConsulta = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection, query, new { Id = Id });
            return resultadoConsulta;
        }

        public async Task<IEnumerable<CategoriaResponse>> Obtener()
        {
            string query = @"core.ObtenerCategorias";
            var resultadoConsulta = await _dapperWrapper.QueryAsync<CategoriaResponse>(_dbConnection, query);
            return resultadoConsulta;
        }

        public async Task<CategoriaDetalle> Obtener(Guid Id)
        {
            string query = @"core.ObtenerCategoria";
            var resultadoConsulta = await _dapperWrapper.QueryAsync<CategoriaDetalle>(
                _dbConnection, query, new { Id, CategoriaId = Id });
            return resultadoConsulta.FirstOrDefault() ?? new CategoriaDetalle();
        }
        #endregion

        #region Helpers
        private async Task verificarCategoriaExiste(Guid Id)
        {
            CategoriaDetalle? resultadoConsultaCategoria = await Obtener(Id);
            if (resultadoConsultaCategoria == null || resultadoConsultaCategoria.CategoriaId == Guid.Empty)
                throw new Exception("No se encontro la categoria");
        }
        #endregion

    }
}

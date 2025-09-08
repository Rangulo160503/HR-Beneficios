using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using Abstracciones.Modelos.Servicios.Beneficios;
using System.Data;

namespace DA
{
    public class BeneficioDA : IBeneficioDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly IDapperWrapper _dapperWrapper;
        private readonly IDbConnection _dbConnection;

        public BeneficioDA(IRepositorioDapper repositorioDapper, IDapperWrapper dapperWrapper)
        {
            _repositorioDapper = repositorioDapper ?? throw new ArgumentNullException(nameof(repositorioDapper));
            _dapperWrapper = dapperWrapper ?? throw new ArgumentNullException(nameof(dapperWrapper));
            _dbConnection = _repositorioDapper.ObtenerRepositorio();
        }

        public async Task<IEnumerable<BeneficioResponse>> Obtener()
        {
            const string sp = @"core.ObtenerBeneficios";
            var rows = await _dapperWrapper.QueryAsync<BeneficioResponse>(_dbConnection, sp);
            return rows;
        }

        public async Task<BeneficioDetalle> Obtener(Guid Id)
        {
            const string sp = @"core.ObtenerBeneficio";
            var rows = await _dapperWrapper.QueryAsync<BeneficioDetalle>(_dbConnection, sp, new { Id });
            return rows.FirstOrDefault() ?? new BeneficioDetalle();
        }

        public async Task<Guid> Agregar(BeneficioRequest beneficio)
        {
            const string sp = @"core.AgregarBeneficio";
            var result = await _dapperWrapper.ExecuteScalarAsync<Guid>(_dbConnection, sp, new
            {
                beneficio.Titulo,
                beneficio.Descripcion,
                beneficio.PrecioCRC,
                beneficio.ProveedorId,
                beneficio.CategoriaId,
                beneficio.ImagenUrl,
                beneficio.Condiciones,
                beneficio.VigenciaInicio,
                beneficio.VigenciaFin
            });
            return result;
        }

        public async Task<Guid> Editar(Guid Id, BeneficioRequest beneficio)
        {
            const string sp = @"core.EditarBeneficio";
            var result = await _dapperWrapper.ExecuteScalarAsync<Guid>(_dbConnection, sp, new
            {
                Id,
                beneficio.Titulo,
                beneficio.Descripcion,
                beneficio.PrecioCRC,
                beneficio.ProveedorId,
                beneficio.CategoriaId,
                beneficio.ImagenUrl,
                beneficio.Condiciones,
                beneficio.VigenciaInicio,
                beneficio.VigenciaFin
            });
            return result;
        }

        public async Task<Guid> Eliminar(Guid Id)
        {
            const string sp = @"core.EliminarBeneficio";
            var result = await _dapperWrapper.ExecuteScalarAsync<Guid>(_dbConnection, sp, new { Id });
            return result;
        }
    }
}

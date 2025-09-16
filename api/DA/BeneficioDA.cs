using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using System.Data;
using System.Linq;

namespace DA
{
    public class BeneficioDA : IBeneficioDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly IDbConnection _dbConnection;
        private readonly IDapperWrapper _dapperWrapper;

        public BeneficioDA(IRepositorioDapper repositorioDapper, IDapperWrapper dapperWrapper)
        {
            _repositorioDapper = repositorioDapper ?? throw new ArgumentNullException(nameof(repositorioDapper));
            _dapperWrapper = dapperWrapper ?? throw new ArgumentNullException(nameof(dapperWrapper));
            _dbConnection = _repositorioDapper.ObtenerRepositorio();
        }

        #region Operaciones
        public async Task<Guid> Agregar(BeneficioRequest b)
        {
            const string sp = "core.AgregarBeneficio";
            var id = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection, sp, new
                {
                    Id = Guid.NewGuid(),
                    b.Titulo,
                    b.Descripcion,
                    b.PrecioCRC,
                    b.Condiciones,
                    b.VigenciaInicio,
                    b.VigenciaFin,
                    Imagen = b.Imagen,
                    b.ProveedorId,
                    b.CategoriaId
                    // ⬅️ sin contadores
                },
                null, null, CommandType.StoredProcedure
            );
            return id;
        }
        public async Task<Guid> Editar(Guid Id, BeneficioRequest b)
        {
            const string sp = "core.EditarBeneficio";

            // si no hay bytes, no actualizamos imagen
            var hasNewImage = b.Imagen != null && b.Imagen.Length > 0;
            byte[]? img = hasNewImage ? b.Imagen : null;

            var rid = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection, sp, new
                {
                    Id,
                    b.Titulo,
                    b.Descripcion,
                    b.PrecioCRC,
                    b.Condiciones,
                    b.VigenciaInicio,  // si pueden ser vacías, usa DateTime?
                    b.VigenciaFin,
                    Imagen = (object?)img ?? DBNull.Value,
                    // SOLO si tu SP tiene este flag; si no, quítalo:
                    ActualizarImagen = hasNewImage ? 1 : 0,
                    b.ProveedorId,
                    b.CategoriaId
                },
                commandType: CommandType.StoredProcedure
            );
            return rid;
        }

        public async Task<Guid> Eliminar(Guid Id)
        {
            await verficarBeneficioExiste(Id);
            const string sp = "core.EliminarBeneficio";
            var id = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection, sp, new { Id },
                null, null, CommandType.StoredProcedure
            );
            return id;
        }

        public async Task<IEnumerable<BeneficioResponse>> Obtener()
        {
            const string sp = "core.ObtenerBeneficios";
            var rows = await _dapperWrapper.QueryAsync<BeneficioResponse>(
                _dbConnection, sp, null, null, null, CommandType.StoredProcedure
            );
            return rows;
        }

        public async Task<BeneficioDetalle> Obtener(Guid Id)
        {
            const string sp = "core.ObtenerBeneficio";
            var rows = await _dapperWrapper.QueryAsync<BeneficioDetalle>(
                _dbConnection, sp, new { Id }, null, null, CommandType.StoredProcedure
            );
            return rows.FirstOrDefault() ?? new BeneficioDetalle();
        }
        #endregion

        #region Helpers
        private async Task verficarBeneficioExiste(Guid Id)
        {
            var dto = await Obtener(Id);
            if (dto == null || dto.BeneficioId == Guid.Empty)
                throw new Exception("No se encontro el beneficio");
        }
        #endregion
    }
}

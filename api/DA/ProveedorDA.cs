using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using System.Data;
using System.Linq;

namespace DA
{
    public class ProveedorDA : IProveedorDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly IDbConnection _dbConnection;
        private readonly IDapperWrapper _dapperWrapper;

        public ProveedorDA(IRepositorioDapper repositorioDapper, IDapperWrapper dapperWrapper)
        {
            _repositorioDapper = repositorioDapper ?? throw new ArgumentNullException(nameof(repositorioDapper));
            _dapperWrapper = dapperWrapper ?? throw new ArgumentNullException(nameof(dapperWrapper));
            _dbConnection = _repositorioDapper.ObtenerRepositorio();
        }

        #region Operaciones
        public async Task<Guid> Agregar(ProveedorRequest proveedor)
        {
            const string sp = "core.AgregarProveedor";
            var id = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection, sp, new
                {
                    Id = Guid.NewGuid(),
                    proveedor.Nombre,
                    proveedor.Correo,
                    proveedor.Telefono,
                    proveedor.Activo,
                    proveedor.Imagen,
                    proveedor.Direccion
                },
                null, null, CommandType.StoredProcedure
            );
            return id;
        }

        public async Task<Guid> Editar(Guid Id, ProveedorRequest proveedor)
        {
            await verficarProveedorExiste(Id);
            const string sp = "core.EditarProveedor";
            var id = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection, sp, new
                {
                    Id,
                    proveedor.Nombre,
                    proveedor.Correo,
                    proveedor.Telefono,
                    proveedor.Activo,
                    proveedor.Imagen,
                    proveedor.Direccion
                },
                null, null, CommandType.StoredProcedure
            );
            return id;
        }

        public async Task<Guid> Eliminar(Guid Id)
        {
            await verficarProveedorExiste(Id);
            const string sp = "core.EliminarProveedor";
            var id = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection, sp, new { Id },
                null, null, CommandType.StoredProcedure
            );
            return id;
        }

        public async Task<IEnumerable<ProveedorResponse>> Obtener()
        {
            const string sp = "core.ObtenerProveedores";
            var rows = await _dapperWrapper.QueryAsync<ProveedorResponse>(
                _dbConnection, sp, null, null, null, CommandType.StoredProcedure
            );
            return rows;
        }

        public async Task<ProveedorDetalle> Obtener(Guid Id)
        {
            const string sp = "core.ObtenerProveedor";
            var rows = await _dapperWrapper.QueryAsync<ProveedorDetalle>(
                _dbConnection, sp, new { Id }, null, null, CommandType.StoredProcedure
            );
            return rows.FirstOrDefault() ?? new ProveedorDetalle();
        }
        #endregion

        #region Helpers
        private async Task verficarProveedorExiste(Guid Id)
        {
            var dto = await Obtener(Id);
            if (dto == null || dto.ProveedorId == Guid.Empty)
                throw new Exception("No se encontro el proveedor");
        }
        #endregion
    }
}

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
            string query = @"core.AgregarProveedor";
            var resultadoConsulta = await _dapperWrapper.ExecuteScalarAsync<Guid>(_dbConnection, query, new
            {
                proveedor.Nombre,
                proveedor.Correo,
                proveedor.Telefono,
                proveedor.Activo,
                proveedor.Imagen
            });
            return resultadoConsulta;
        }

        public async Task<Guid> Editar(Guid Id, ProveedorRequest proveedor)
        {
            await verficarProveedorExiste(Id);
            string query = @"core.EditarProveedor";
            var resultadoConsulta = await _dapperWrapper.ExecuteScalarAsync<Guid>(_dbConnection, query, new
            {
                Id = Id,
                Nombre = proveedor.Nombre,
                Correo = proveedor.Correo,
                Telefono = proveedor.Telefono,
                Activo = proveedor.Activo,
                Imagen = proveedor.Imagen
            });
            return resultadoConsulta;
        }

        public async Task<Guid> Eliminar(Guid Id)
        {
            await verficarProveedorExiste(Id);
            string query = @"core.EliminarProveedor";
            var resultadoConsulta = await _dapperWrapper.ExecuteScalarAsync<Guid>(_dbConnection, query, new
            {
                Id = Id
            });
            return resultadoConsulta;
        }

        public async Task<IEnumerable<ProveedorResponse>> Obtener()
        {
            string query = @"core.ObtenerProveedores";
            var resultadoConsulta = await _dapperWrapper.QueryAsync<ProveedorResponse>(_dbConnection, query);
            return resultadoConsulta;
        }

        public async Task<ProveedorDetalle> Obtener(Guid Id)
        {
            string query = @"core.ObtenerProveedor";
            var resultadoConsulta = await _dapperWrapper.QueryAsync<ProveedorDetalle>(_dbConnection, query, new
            {
                Id = Id
            });
            return resultadoConsulta.FirstOrDefault() ?? new ProveedorDetalle();
        }
        #endregion

        #region Helpers
        private async Task verficarProveedorExiste(Guid Id)
        {
            ProveedorDetalle? resultadoConsultaProveedor = await Obtener(Id);
            if (resultadoConsultaProveedor == null || resultadoConsultaProveedor.ProveedorId == Guid.Empty)
                throw new Exception("No se encontro el proveedor");
        }
        #endregion
    }
}

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
    public class ProductoDA : IProductoDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly IDbConnection _dbConnection;
        private readonly IDapperWrapper _dapperWrapper;

        public ProductoDA(IRepositorioDapper repositorioDapper, IDapperWrapper dapperWrapper)
        {
            _repositorioDapper = repositorioDapper ?? throw new ArgumentNullException(nameof(repositorioDapper));
            _dapperWrapper = dapperWrapper ?? throw new ArgumentNullException(nameof(dapperWrapper));
            _dbConnection = _repositorioDapper.ObtenerRepositorio();
        }

        #region Operaciones
        public async Task<IEnumerable<Producto>> Obtener()
        {
            const string sp = "core.ObtenerProductos";
            return await _dapperWrapper.QueryAsync<Producto>(_dbConnection, sp,
                commandType: CommandType.StoredProcedure);
        }

        public async Task<Producto> Obtener(Guid Id)
        {
            const string sp = "core.ObtenerProducto";
            var rows = await _dapperWrapper.QueryAsync<Producto>(_dbConnection, sp, new { ProductoId = Id },
                commandType: CommandType.StoredProcedure);
            return rows.FirstOrDefault() ?? new Producto();
        }

        public async Task<Guid> Agregar(Producto p)
        {
            const string sp = "core.Producto_Insertar";
            var id = await _dapperWrapper.ExecuteScalarAsync<Guid>(_dbConnection, sp, new
            {
                p.Nombre,
                p.Descripcion
            }, commandType: CommandType.StoredProcedure);
            return id;
        }

        public async Task<Guid> Editar(Guid Id, Producto p)
        {
            const string sp = "core.Producto_Actualizar";
            var rid = await _dapperWrapper.ExecuteScalarAsync<Guid>(_dbConnection, sp, new
            {
                Id,                    // parámetro del SP
                p.Nombre,
                p.Descripcion
            }, commandType: CommandType.StoredProcedure);
            return rid;
        }

        public async Task<Guid> Eliminar(Guid Id)
        {
            await VerificarExiste(Id);
            const string sp = "core.Producto_Eliminar";
            var rid = await _dapperWrapper.ExecuteScalarAsync<Guid>(_dbConnection, sp, new { Id },
                commandType: CommandType.StoredProcedure);
            return rid;
        }
        #endregion

        #region Helpers
        private async Task VerificarExiste(Guid id)
        {
            var dto = await Obtener(id);
            if (dto == null || dto.ProductoId == Guid.Empty)
                throw new Exception("No se encontró el producto.");
        }
        #endregion
    }
}

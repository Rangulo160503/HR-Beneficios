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
    public class BeneficioImagenDA : IBeneficioImagenDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly IDbConnection _dbConnection;
        private readonly IDapperWrapper _dapperWrapper;

        public BeneficioImagenDA(IRepositorioDapper repositorioDapper, IDapperWrapper dapperWrapper)
        {
            _repositorioDapper = repositorioDapper ?? throw new ArgumentNullException(nameof(repositorioDapper));
            _dapperWrapper = dapperWrapper ?? throw new ArgumentNullException(nameof(dapperWrapper));
            _dbConnection = _repositorioDapper.ObtenerRepositorio();
        }

        #region Operaciones

        //  Obtiene todas las imágenes asociadas a un beneficio
        public async Task<IEnumerable<BeneficioImagenResponse>> Obtener(Guid BeneficioId)
        {
            const string sp = "core.BeneficioImagen_ListarPorBeneficio";
            var rows = await _dapperWrapper.QueryAsync<BeneficioImagenResponse>(
                _dbConnection, sp, new { BeneficioId }, null, null, CommandType.StoredProcedure
            );
            return rows;
        }

        //  Obtiene una imagen específica por su Id
        public async Task<BeneficioImagenDetalle> ObtenerPorId(Guid ImagenId)
        {
            const string sp = "core.BeneficioImagen_Obtener";
            var rows = await _dapperWrapper.QueryAsync<BeneficioImagenDetalle>(
                _dbConnection, sp, new { ImagenId }, null, null, CommandType.StoredProcedure
            );
            return rows.FirstOrDefault() ?? new BeneficioImagenDetalle();
        }

        //  Inserta una nueva imagen asociada a un beneficio
        public async Task<Guid> Agregar(BeneficioImagenRequest beneficioImagen)
        {
            const string sp = "core.BeneficioImagen_Insertar";
            var id = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection, sp, new
                {
                    beneficioImagen.BeneficioId,
                    beneficioImagen.Imagen,
                    beneficioImagen.Orden
                },
                null, null, CommandType.StoredProcedure
            );
            return id;
        }

        //  Actualiza los datos o la imagen de una entrada existente
        public async Task<Guid> Editar(Guid imagenId, BeneficioImagenRequest req)
        {
            const string sp = "core.BeneficioImagen_Actualizar";

            // Nota: los nombres deben coincidir EXACTO con los parámetros del SP
            var result = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection,
                sp,
                new
                {
                    ImagenId = imagenId,
                    BeneficioId = req.BeneficioId,   // <-- FALTABA
                    Imagen = req.Imagen,        // null => COALESCE en el SP
                    Orden = req.Orden          // null => conserva orden
                },
                commandType: CommandType.StoredProcedure
            );

            return result;
        }

        //  Elimina una imagen asociada al beneficio
        public async Task<Guid> Eliminar(Guid ImagenId)
        {
            const string sp = "core.BeneficioImagen_Eliminar";
            var id = await _dapperWrapper.ExecuteScalarAsync<Guid>(
                _dbConnection, sp, new { ImagenId },
                null, null, CommandType.StoredProcedure
            );
            return id;
        }

        #endregion
    }
}

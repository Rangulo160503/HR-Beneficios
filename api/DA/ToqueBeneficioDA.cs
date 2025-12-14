using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using System.Data;

namespace DA
{
    public class ToqueBeneficioDA : IToqueBeneficioDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly IDapperWrapper _dapperWrapper;
        private readonly IDbConnection _dbConnection;

        public ToqueBeneficioDA(IRepositorioDapper repositorioDapper, IDapperWrapper dapperWrapper)
        {
            _repositorioDapper = repositorioDapper ?? throw new ArgumentNullException(nameof(repositorioDapper));
            _dapperWrapper = dapperWrapper ?? throw new ArgumentNullException(nameof(dapperWrapper));
            _dbConnection = _repositorioDapper.ObtenerRepositorio();
        }

        public async Task<ToqueBeneficio> Registrar(Guid beneficioId, string? origen)
        {
            const string sql = @"
INSERT INTO core.ToqueBeneficio (BeneficioId, Fecha, Origen)
OUTPUT INSERTED.ToqueBeneficioId, INSERTED.BeneficioId, INSERTED.Fecha, INSERTED.Origen
VALUES (@BeneficioId, SYSUTCDATETIME(), @Origen);
";

            var toque = await _dapperWrapper.QueryFirstOrDefaultAsync<ToqueBeneficio>(
                _dbConnection,
                sql,
                new { BeneficioId = beneficioId, Origen = origen },
                commandType: CommandType.Text
            );

            return toque ?? new ToqueBeneficio
            {
                BeneficioId = beneficioId,
                Fecha = DateTime.UtcNow,
                Origen = origen
            };
        }

        public async Task<IEnumerable<ToqueBeneficioDia>> ObtenerSeries(Guid beneficioId, DateTime desde, DateTime hasta)
        {
            const string sql = @"
SELECT CAST(Fecha AS date) AS [Date], COUNT(*) AS [Count]
FROM core.ToqueBeneficio
WHERE BeneficioId = @BeneficioId AND Fecha >= @Desde AND Fecha < @Hasta
GROUP BY CAST(Fecha AS date)
ORDER BY [Date];
";

            return await _dapperWrapper.QueryAsync<ToqueBeneficioDia>(
                _dbConnection,
                sql,
                new { BeneficioId = beneficioId, Desde = desde, Hasta = hasta },
                commandType: CommandType.Text
            );
        }
    }
}

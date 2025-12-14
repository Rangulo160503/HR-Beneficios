using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using System.Data;
using System.Linq;

namespace DA
{
    public class ToqueBeneficioDA : IToqueBeneficioDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly IDapperWrapper _dapperWrapper;

        public ToqueBeneficioDA(IRepositorioDapper repositorioDapper, IDapperWrapper dapperWrapper)
        {
            _repositorioDapper = repositorioDapper ?? throw new ArgumentNullException(nameof(repositorioDapper));
            _dapperWrapper = dapperWrapper ?? throw new ArgumentNullException(nameof(dapperWrapper));
        }

        public async Task<ToqueBeneficio> Registrar(Guid beneficioId, string? origen)
        {
            const string sql = @"
INSERT INTO core.ToqueBeneficio (BeneficioId, Fecha, Origen)
OUTPUT INSERTED.ToqueBeneficioId, INSERTED.BeneficioId, INSERTED.Fecha, INSERTED.Origen
VALUES (@BeneficioId, SYSUTCDATETIME(), @Origen);
";

            using var connection = _repositorioDapper.ObtenerRepositorio();

            var toque = await _dapperWrapper.QueryFirstOrDefaultAsync<ToqueBeneficio>(
                connection,
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

        public async Task<ToqueBeneficioAnalyticsResponse> ObtenerAnalytics(
            Guid beneficioId,
            DateTime desde,
            DateTime hasta,
            string granularity,
            DateTime prevDesde,
            DateTime prevHasta)
        {
            var isMonthly = string.Equals(granularity, "MONTH", StringComparison.OrdinalIgnoreCase);

            var sqlSeries = isMonthly
                ? @"
SELECT DATEFROMPARTS(YEAR(Fecha), MONTH(Fecha), 1) AS [Date], COUNT(*) AS [Count]
FROM core.ToqueBeneficio
WHERE BeneficioId = @BeneficioId AND Fecha >= @Desde AND Fecha < @Hasta
GROUP BY YEAR(Fecha), MONTH(Fecha)
ORDER BY [Date];
"
                : @"
SELECT CAST(Fecha AS date) AS [Date], COUNT(*) AS [Count]
FROM core.ToqueBeneficio
WHERE BeneficioId = @BeneficioId AND Fecha >= @Desde AND Fecha < @Hasta
GROUP BY CAST(Fecha AS date)
ORDER BY [Date];
";

            const string sqlTotals = @"
SELECT
    SUM(CASE WHEN Fecha >= @Desde AND Fecha < @Hasta THEN 1 ELSE 0 END) AS Total,
    SUM(CASE WHEN Fecha >= @PrevDesde AND Fecha < @PrevHasta THEN 1 ELSE 0 END) AS PrevTotal
FROM core.ToqueBeneficio
WHERE BeneficioId = @BeneficioId;
";

            const string sqlKpis = @"
SELECT
    SUM(CASE WHEN CAST(Fecha AS date) = CAST(SYSUTCDATETIME() AS date) THEN 1 ELSE 0 END) AS Today,
    SUM(CASE WHEN Fecha >= DATEADD(day, -6, CAST(SYSUTCDATETIME() AS date)) AND Fecha < DATEADD(day, 1, CAST(SYSUTCDATETIME() AS date)) THEN 1 ELSE 0 END) AS Last7d,
    SUM(CASE WHEN Fecha >= DATEFROMPARTS(YEAR(SYSUTCDATETIME()), 1, 1) AND Fecha < DATEADD(day, 1, CAST(SYSUTCDATETIME() AS date)) THEN 1 ELSE 0 END) AS Ytd
FROM core.ToqueBeneficio
WHERE BeneficioId = @BeneficioId;
";

            using var connection = _repositorioDapper.ObtenerRepositorio();

            var series = await _dapperWrapper.QueryAsync<ToqueBeneficioDia>(
                connection,
                sqlSeries,
                new { BeneficioId = beneficioId, Desde = desde, Hasta = hasta },
                commandType: CommandType.Text
            );

            var normalizedSeries = series
                .Select(s =>
                {
                    var dateOnly = s.Date.Date;
                    var iso = dateOnly.ToString("yyyy-MM-dd");

                    return new ToqueBeneficioDia
                    {
                        Date = dateOnly,
                        Count = s.Count,
                        Iso = iso,
                        Label = iso
                    };
                })
                .ToList();

            var totals = await _dapperWrapper.QueryFirstOrDefaultAsync<AnalyticsTotals>(
                connection,
                sqlTotals,
                new { BeneficioId = beneficioId, Desde = desde, Hasta = hasta, PrevDesde = prevDesde, PrevHasta = prevHasta },
                commandType: CommandType.Text
            ) ?? new AnalyticsTotals();

            var kpis = await _dapperWrapper.QueryFirstOrDefaultAsync<ToqueBeneficioKpis>(
                connection,
                sqlKpis,
                new { BeneficioId = beneficioId },
                commandType: CommandType.Text
            ) ?? new ToqueBeneficioKpis();

            return new ToqueBeneficioAnalyticsResponse
            {
                BeneficioId = beneficioId,
                Range = string.Empty,
                Granularity = granularity,
                From = desde,
                To = hasta,
                Series = normalizedSeries,
                Total = totals.Total,
                PrevFrom = prevDesde,
                PrevTo = prevHasta,
                PrevTotal = totals.PrevTotal,
                Kpis = kpis
            };
        }

        public async Task<IEnumerable<ToqueBeneficioResumen>> ObtenerResumen(DateTime desde, DateTime hasta)
        {
            const string sql = @"
SELECT BeneficioId, COUNT(*) AS [Count]
FROM core.ToqueBeneficio
WHERE Fecha >= @Desde AND Fecha < @Hasta
GROUP BY BeneficioId;
";

            using var connection = _repositorioDapper.ObtenerRepositorio();

            var resumen = await _dapperWrapper.QueryAsync<ToqueBeneficioResumen>(
                connection,
                sql,
                new { Desde = desde, Hasta = hasta },
                commandType: CommandType.Text
            );

            return resumen.ToList();
        }

        private class AnalyticsTotals
        {
            public int Total { get; set; }
            public int PrevTotal { get; set; }
        }
    }
}

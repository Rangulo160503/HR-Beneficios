using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using System.Linq;

namespace Flujo
{
    public class ToqueBeneficioFlujo : IToqueBeneficioFlujo
    {
        private readonly IToqueBeneficioDA _toqueBeneficioDA;

        public ToqueBeneficioFlujo(IToqueBeneficioDA toqueBeneficioDA)
        {
            _toqueBeneficioDA = toqueBeneficioDA ?? throw new ArgumentNullException(nameof(toqueBeneficioDA));
        }

        public async Task<ToqueBeneficio> Registrar(Guid beneficioId, string? origen)
        {
            return await _toqueBeneficioDA.Registrar(beneficioId, origen);
        }

        public async Task<ToqueBeneficioAnalyticsResponse> ObtenerAnalytics(Guid beneficioId, string? rango)
        {
            var today = DateTime.UtcNow.Date;
            var normalizedRange = NormalizarRango(rango);

            var (desde, hasta) = normalizedRange switch
            {
                "1M" => (today.AddDays(-29), today),
                "YTD" => (new DateTime(today.Year, 1, 1), today),
                _ => (today.AddDays(-6), today)
            };

            // Hasta es exclusivo en la consulta para incluir el día completo
            var series = await _toqueBeneficioDA.ObtenerSeries(beneficioId, desde, hasta.AddDays(1));
            var seriesNormalizada = NormalizarSeries(series, desde, hasta);

            return new ToqueBeneficioAnalyticsResponse
            {
                BeneficioId = beneficioId,
                Range = normalizedRange,
                From = desde,
                To = hasta,
                Series = seriesNormalizada,
                Total = seriesNormalizada.Sum(s => s.Count)
            };
        }

        private static string NormalizarRango(string? rango)
        {
            return string.IsNullOrWhiteSpace(rango)
                ? "1W"
                : rango.Trim().ToUpperInvariant();
        }

        private static IEnumerable<ToqueBeneficioDia> NormalizarSeries(IEnumerable<ToqueBeneficioDia> series, DateTime desde, DateTime hasta)
        {
            var porDia = series.ToDictionary(s => s.Date.Date, s => s.Count);
            var cursor = desde.Date;
            while (cursor <= hasta.Date)
            {
                yield return new ToqueBeneficioDia
                {
                    Date = cursor,
                    Count = porDia.TryGetValue(cursor, out var count) ? count : 0
                };

                cursor = cursor.AddDays(1);
            }
        }
    }
}

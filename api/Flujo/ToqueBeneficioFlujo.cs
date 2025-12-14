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

        public async Task<ToqueBeneficioAnalyticsResponse> ObtenerAnalytics(Guid beneficioId, string? rango, string? granularity)
        {
            var today = DateTime.UtcNow.Date;
            var normalizedRange = NormalizarRango(rango);
            var normalizedGranularity = NormalizarGranularidad(granularity, normalizedRange);
            var (desde, hasta) = CalcularVentana(normalizedRange, today);
            var (prevDesde, prevHasta) = CalcularVentanaPrevia(normalizedRange, desde, hasta, today);

            var analytics = await _toqueBeneficioDA.ObtenerAnalytics(
                beneficioId,
                desde,
                hasta.AddDays(1),
                normalizedGranularity,
                prevDesde,
                prevHasta.AddDays(1));

            var series = TransformarSeries(analytics.Series, normalizedGranularity);

            var delta = analytics.Total - analytics.PrevTotal;
            var deltaPct = analytics.PrevTotal == 0
                ? (double?)null
                : Math.Round((double)delta / analytics.PrevTotal * 100, 2);

            return new ToqueBeneficioAnalyticsResponse
            {
                BeneficioId = beneficioId,
                Range = normalizedRange,
                Granularity = normalizedGranularity,
                From = desde,
                To = hasta,
                PrevFrom = prevDesde,
                PrevTo = prevHasta,
                PrevTotal = analytics.PrevTotal,
                Series = series,
                Total = analytics.Total,
                Delta = delta,
                DeltaPct = deltaPct,
                Kpis = analytics.Kpis
            };
        }

        public async Task<IEnumerable<ToqueBeneficioResumen>> ObtenerResumen(string? rango)
        {
            var today = DateTime.UtcNow.Date;
            var normalizedRange = NormalizarRango(rango);
            var (desde, hasta) = CalcularVentana(normalizedRange, today);

            return await _toqueBeneficioDA.ObtenerResumen(desde, hasta.AddDays(1));
        }

        private static string NormalizarRango(string? rango)
        {
            return string.IsNullOrWhiteSpace(rango)
                ? "1W"
                : rango.Trim().ToUpperInvariant();
        }

        private static string NormalizarGranularidad(string? granularidad, string rango)
        {
            if (!string.IsNullOrWhiteSpace(granularidad))
            {
                var g = granularidad.Trim().ToUpperInvariant();
                if (g is "DAY" or "MONTH") return g;
            }

            return rango switch
            {
                "YTD" => "MONTH",
                "1M" => "DAY",
                _ => "DAY",
            };
        }

        private static (DateTime desde, DateTime hasta) CalcularVentana(string rango, DateTime today)
        {
            return rango switch
            {
                "1M" => (today.AddDays(-29), today),
                "YTD" => (new DateTime(today.Year, 1, 1), today),
                _ => (today.AddDays(-6), today)
            };
        }

        private static (DateTime desde, DateTime hasta) CalcularVentanaPrevia(string rango, DateTime desde, DateTime hasta, DateTime today)
        {
            return rango switch
            {
                "1M" => (desde.AddDays(-30), hasta.AddDays(-30)),
                "YTD" => CalcularVentanaAnteriorYtd(today),
                _ => (desde.AddDays(-7), hasta.AddDays(-7))
            };
        }

        private static (DateTime desde, DateTime hasta) CalcularVentanaAnteriorYtd(DateTime today)
        {
            var previousYear = today.Year - 1;
            if (previousYear < DateTime.MinValue.Year)
            {
                return (today, today);
            }

            var prevDesde = new DateTime(previousYear, 1, 1);
            var prevHasta = new DateTime(previousYear, 12, 31);
            return (prevDesde, prevHasta);
        }

        private static IEnumerable<ToqueBeneficioDia> TransformarSeries(IEnumerable<ToqueBeneficioDia> series, string granularity)
        {
            var ordered = series
                .Select(s =>
                {
                    var date = s.Date == default && !string.IsNullOrWhiteSpace(s.Iso)
                        ? DateTime.TryParse(s.Iso, out var parsed) ? parsed.Date : DateTime.MinValue
                        : s.Date.Date;

                    var iso = !string.IsNullOrWhiteSpace(s.Iso)
                        ? s.Iso
                        : date != DateTime.MinValue
                            ? date.ToString("yyyy-MM-dd")
                            : string.Empty;

                    return new ToqueBeneficioDia
                    {
                        Date = date,
                        Count = s.Count,
                        Iso = iso,
                        Label = iso
                    };
                })
                .Where(s => s.Date != DateTime.MinValue)
                .OrderBy(s => s.Date)
                .ToList();

            foreach (var punto in ordered)
            {
                var label = granularity == "MONTH"
                    ? punto.Date.ToString("yyyy-MM")
                    : punto.Iso;

                yield return new ToqueBeneficioDia
                {
                    Date = punto.Date,
                    Count = punto.Count,
                    Iso = punto.Iso,
                    Label = label
                };
            }
        }
    }
}

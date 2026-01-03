using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class ToqueBeneficio
    {
        public Guid ToqueBeneficioId { get; set; }
        public Guid BeneficioId { get; set; }
        public DateTime Fecha { get; set; }
        public string? Origen { get; set; }
    }

    public class ToqueBeneficioDia
    {
        public DateTime Date { get; set; }
        public int Count { get; set; }
        public string Label { get; set; } = string.Empty;
        public string Iso { get; set; } = string.Empty;
        public string Fecha => string.IsNullOrWhiteSpace(Iso) ? Date.ToString("yyyy-MM-dd") : Iso;
        public int Total => Count;
    }

    public class ToqueBeneficioAnalyticsResponse
    {
        public Guid BeneficioId { get; set; }
        public string Range { get; set; } = string.Empty;
        public string Granularity { get; set; } = string.Empty;
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public IEnumerable<ToqueBeneficioDia> Series { get; set; } = Enumerable.Empty<ToqueBeneficioDia>();
        public int Total { get; set; }
        public DateTime PrevFrom { get; set; }
        public DateTime PrevTo { get; set; }
        public int PrevTotal { get; set; }
        public int Delta { get; set; }
        public double? DeltaPct { get; set; }
        public ToqueBeneficioKpis Kpis { get; set; } = new();
    }

    public class ToqueBeneficioKpis
    {
        public int Today { get; set; }
        public int Last7d { get; set; }
        public int Ytd { get; set; }
    }

    public class ToqueBeneficioRequest
    {
        [Required]
        public string BeneficioId { get; set; } = string.Empty;
        public string? Origen { get; set; }
    }

    public class ToqueBeneficioResumen
    {
        public Guid BeneficioId { get; set; }
        public int Count { get; set; }
    }
}

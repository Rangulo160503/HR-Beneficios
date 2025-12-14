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
    }

    public class ToqueBeneficioAnalyticsResponse
    {
        public Guid BeneficioId { get; set; }
        public string Range { get; set; } = string.Empty;
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public IEnumerable<ToqueBeneficioDia> Series { get; set; } = Enumerable.Empty<ToqueBeneficioDia>();
        public int Total { get; set; }
    }

    public class ToqueBeneficioRequest
    {
        [Required]
        public string BeneficioId { get; set; } = string.Empty;
        public string? Origen { get; set; }
    }
}

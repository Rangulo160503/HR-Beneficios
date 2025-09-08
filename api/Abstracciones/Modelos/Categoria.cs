using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class CategoriaBase
    {
        [Required, StringLength(160, MinimumLength = 2)]
        public string Nombre { get; set; } = null!;

        [Required]
        public bool Activa { get; set; } = true;
    }

    public class CategoriaRequest : CategoriaBase { }

    public class CategoriaResponse : CategoriaBase
    {
        public Guid CategoriaId { get; set; }            // ← Guid
        public DateTime? CreadoEn { get; set; }
        public DateTime? ModificadoEn { get; set; }
    }

    // Si más adelante querés campos extra, agrégalos aquí
    public class CategoriaDetalle : CategoriaResponse
    {
        // Ejemplos opcionales:
        // public int CantidadBeneficiosAsociados { get; set; }
        // public string? DescripcionLarga { get; set; }
    }
}

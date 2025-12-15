using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class RifaParticipacionBase
    {
        [Required, StringLength(150, MinimumLength = 3)]
        public string Nombre { get; set; } = string.Empty;

        [Required, EmailAddress, StringLength(200)]
        public string Correo { get; set; } = string.Empty;

        [StringLength(30)]
        public string? Telefono { get; set; }

        public string? Mensaje { get; set; }

        [StringLength(30)]
        public string Source { get; set; } = "web";
    }

    public class RifaParticipacionRequest : RifaParticipacionBase
    {
    }

    public class RifaParticipacionResponse : RifaParticipacionBase
    {
        public int Id { get; set; }

        [Required, StringLength(30)]
        public string Estado { get; set; } = "Nuevo";

        public DateTime FechaCreacion { get; set; }
    }

    public class RifaParticipacionEstadoRequest
    {
        [Required]
        [RegularExpression("^(Nuevo|Contactado|Ganador|Descartado)$", ErrorMessage = "Estado inválido")]
        public string Estado { get; set; } = string.Empty;
    }

    public class RifaParticipacionFiltro
    {
        public string? Q { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public string SortCampo { get; set; } = "FechaCreacion";
        public string SortDir { get; set; } = "DESC";
    }

    public class RifaParticipacionListado : RifaParticipacionResponse
    {
        public int TotalFiltrado { get; set; }
    }
}

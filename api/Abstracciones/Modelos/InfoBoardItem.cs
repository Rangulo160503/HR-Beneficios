using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class InfoBoardItemBase
    {
        [Required, StringLength(120, MinimumLength = 1)]
        public string Titulo { get; set; } = null!;

        [StringLength(500)]
        public string? Descripcion { get; set; }

        [Required, StringLength(500), Url]
        public string Url { get; set; } = null!;

        [StringLength(50)]
        public string? Tipo { get; set; }

        public int Prioridad { get; set; } = 0;

        public bool Activo { get; set; } = true;

        public DateTime? FechaInicio { get; set; }

        public DateTime? FechaFin { get; set; }
    }

    public class InfoBoardItemRequest : InfoBoardItemBase
    {
    }

    public class InfoBoardItemResponse : InfoBoardItemBase
    {
        public Guid InfoBoardItemId { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}

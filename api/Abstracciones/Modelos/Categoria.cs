using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class CategoriaBase
    {
        [Required, StringLength(200, MinimumLength = 3)]
        public string Nombre { get; set; } = null!;

        [Required]
        public bool Activa { get; set; }
    }

    public class CategoriaRequest : CategoriaBase
    {
        // Para creación/edición
    }

    public class CategoriaResponse : CategoriaBase
    {
        public Guid CategoriaId { get; set; }
        public DateTime? CreadoEn { get; set; }
        public DateTime? ModificadoEn { get; set; }
    }

    public class CategoriaDetalle : CategoriaResponse
    {
        // Aquí podrías agregar más datos descriptivos
        public string? Descripcion { get; set; }
        public int? CantidadBeneficios { get; set; }
    }
}

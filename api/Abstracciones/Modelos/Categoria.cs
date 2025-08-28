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
        public int CategoriaId { get; set; }
        public DateTime? CreadoEn { get; set; }
        public DateTime? ModificadoEn { get; set; }
    }
}

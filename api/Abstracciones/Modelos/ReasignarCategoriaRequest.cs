using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class ReasignarCategoriaRequest
    {
        [Required]
        public Guid FromCategoriaId { get; set; }

        [Required]
        public Guid ToCategoriaId { get; set; }

        public IEnumerable<Guid>? BeneficioIds { get; set; }
    }
}

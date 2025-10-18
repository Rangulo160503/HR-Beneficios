using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class CategoriaBase
    {
        [Required, StringLength(200, MinimumLength = 3)]
        public string Nombre { get; set; } = null!;
    }

    public class CategoriaRequest : CategoriaBase
    {
        // Para creación/edición
    }

    public class CategoriaResponse : CategoriaBase
    {
        public Guid CategoriaId { get; set; }
    }

    public class CategoriaDetalle : CategoriaResponse
    {
        // Datos descriptivos opcionales
        
    }
}

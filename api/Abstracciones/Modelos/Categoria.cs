using System;
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

    public class ReasignarCategoriaBase
    {
        [Required]
        public Guid FromCategoriaId { get; set; }

        [Required]
        public Guid ToCategoriaId { get; set; }
    }

    public class ReasignarCategoriaRequest : ReasignarCategoriaBase
    {
        public IEnumerable<Guid>? BeneficioIds { get; set; }
    }

    public class ReasignarCategoriaResponse : ReasignarCategoriaBase
    {
        public int Actualizados { get; set; }
    }
}

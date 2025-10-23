using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Modelos
{
    public class AreaDeCategoriaBase
    {
        [Required, StringLength(150, MinimumLength = 3)]
        public string Nombre { get; set; } = null!;
    }

    public class AreaDeCategoriaRequest : AreaDeCategoriaBase
    {
        // No requiere Id porque se genera automáticamente en la DB
    }

    public class AreaDeCategoriaResponse : AreaDeCategoriaBase
    {
        public Guid AreaDeCategoriaId { get; set; }
    }

    public class AreaDeCategoriaDetalle : AreaDeCategoriaResponse
    {

    }
}

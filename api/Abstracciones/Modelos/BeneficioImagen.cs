using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Modelos
{
    public class BeneficioImagenBase
    {
        [Required]
        public Guid BeneficioId { get; set; }

        [Required]
        public byte[] Imagen { get; set; } = Array.Empty<byte>();

        [Range(1, int.MaxValue, ErrorMessage = "El orden debe ser un número positivo.")]
        public int Orden { get; set; } = 1;
    }

    public class BeneficioImagenRequest : BeneficioImagenBase
    {
    }

    public class BeneficioImagenResponse : BeneficioImagenBase
    {
        [Required]
        public Guid ImagenId { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime CreadoEn { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime ModificadoEn { get; set; }
    }

    public class BeneficioImagenDetalle : BeneficioImagenResponse
    {
    }
}

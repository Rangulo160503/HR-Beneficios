using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Modelos
{
    //  Imagen base (masa cruda)
    public class BeneficioImagenBase
    {
        [Required]
        public Guid BeneficioId { get; set; }

        // Imagen almacenada como binario
        [Required]
        public byte[] Imagen { get; set; } = Array.Empty<byte>();

        [Range(1, int.MaxValue, ErrorMessage = "El orden debe ser un número positivo.")]
        public int Orden { get; set; } = 1;
    }

    //  Request: mezcla lista para hornear (crear/editar)
    public class BeneficioImagenRequest : BeneficioImagenBase
    {
        // No necesita campos adicionales por ahora,
        // pero se deja la clase separada para mantener consistencia
    }

    //  Response: queque ya horneado (lo que entregamos al usuario)
    public class BeneficioImagenResponse : BeneficioImagenBase
    {
        [Required]
        public Guid ImagenId { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime CreadoEn { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime ModificadoEn { get; set; }
    }

    //  Detalle: queque servido en la mesa (vista detallada)
    public class BeneficioImagenDetalle : BeneficioImagenResponse
    {
        // Aquí podrías agregar métricas u otra información futura,
        // como "visualizaciones" o "quién la subió"
    }
}

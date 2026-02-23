using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public enum EstadoBeneficio
    {
        Pendiente = 0,
        Aprobado = 1,
        Rechazado = 2
    }
    public class BeneficioBase
    {
        [Required, StringLength(200, MinimumLength = 3)]
        public string Titulo { get; set; } = null!;

        [Required]
        public string Descripcion { get; set; } = null!;

        [Required, Range(0, double.MaxValue)]
        public decimal PrecioCRC { get; set; }

        public string? Condiciones { get; set; }

        [DataType(DataType.Date)]
        public DateTime VigenciaInicio { get; set; }

        [DataType(DataType.Date)]
        public DateTime VigenciaFin { get; set; }

        // Imagen guardada como binario
        public byte[]? Imagen { get; set; }
    }

    // Mezcla cruda lista para "entrar al horno" → creación/edición
    public class BeneficioRequest : BeneficioBase
    {
        public Guid ProveedorId { get; set; }
        public Guid CategoriaId { get; set; }
        public bool? PrecioDesde { get; set; }
    }

    // Queque ya horneado y decorado → lo que entregamos al usuario
    public class BeneficioResponse : BeneficioBase
    {
        public Guid BeneficioId { get; set; }
        public string? ProveedorNombre { get; set; }
        public string? CategoriaNombre { get; set; }
        public Guid ProveedorId { get; set; }
        public Guid CategoriaId { get; set; }
        // Estado de aprobación del beneficio
        public EstadoBeneficio Estado { get; set; } = EstadoBeneficio.Pendiente;

        // Tiempos y trazabilidad de aprobación
        public DateTime FechaCreacion { get; set; }
        public DateTime? FechaAprobacion { get; set; }
        public Guid? AprobadoPorUsuarioId { get; set; }
    }

    // Queque servido en la mesa → con métricas adicionales
    public class BeneficioDetalle : BeneficioResponse
    {
        public int? VecesSeleccionado { get; set; }
        public int? VouchersEmitidos { get; set; }
        public int? VouchersCanjeados { get; set; }
    }

    public class BeneficioPorCategoriaBase : BeneficioResponse
    {
    }

    public class BeneficioPorCategoriaResponse : BeneficioPorCategoriaBase
    {
        /// <summary>
        /// Total de registros en la consulta paginada.
        /// </summary>
        public int Total { get; set; }
    }

    public class BeneficioPorCategoriaDetalle : BeneficioPorCategoriaResponse
    {
    }
}

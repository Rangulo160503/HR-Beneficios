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

        public byte[]? Imagen { get; set; }
    }

    public class BeneficioRequest : BeneficioBase
    {
        public Guid ProveedorId { get; set; }
        public Guid CategoriaId { get; set; }
    }

    public class BeneficioResponse : BeneficioBase
    {
        public Guid BeneficioId { get; set; }
        public string? ProveedorNombre { get; set; }
        public string? CategoriaNombre { get; set; }
        public Guid ProveedorId { get; set; }
        public Guid CategoriaId { get; set; }
        public EstadoBeneficio Estado { get; set; } = EstadoBeneficio.Pendiente;

        public DateTime FechaCreacion { get; set; }
        public DateTime? FechaAprobacion { get; set; }
        public Guid? AprobadoPorUsuarioId { get; set; }
    }

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
        public int Total { get; set; }
    }

    public class BeneficioPorCategoriaDetalle : BeneficioPorCategoriaResponse
    {
    }
}

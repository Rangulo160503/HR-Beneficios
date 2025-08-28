using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public static class BeneficioEstados
    {
        public const string Borrador = "Borrador";
        public const string Publicado = "Publicado";
        public const string Inactivo = "Inactivo";
        public const string Archivado = "Archivado";
    }

    public static class BeneficioOrigenes
    {
        public const string Manual = "manual";
        public const string Email = "email";
    }

    public class BeneficioBase
    {
        [Required, StringLength(280, MinimumLength = 3)]   // BD: nvarchar(280)
        public string Titulo { get; set; } = null!;

        [Required]                                         // BD: nvarchar(MAX)
        public string Descripcion { get; set; } = null!;

        [Required, Range(0, double.MaxValue)]
        public decimal PrecioCRC { get; set; }

        [Required] public int ProveedorId { get; set; }
        [Required] public int CategoriaId { get; set; }

        [Url, MaxLength(800)]                              // BD: nvarchar(800)
        public byte[]? ImagenUrl { get; set; }
        public string? Condiciones { get; set; }

        [DataType(DataType.Date)] public DateTime VigenciaInicio { get; set; }
        [DataType(DataType.Date)] public DateTime VigenciaFin { get; set; }

        [Required] public string Estado { get; set; } = BeneficioEstados.Borrador; // BD: nvarchar(40)
        [Required] public bool Disponible { get; set; } = true;
        [Required] public string Origen { get; set; } = BeneficioOrigenes.Manual;  // BD: nvarchar(20)
    }

    public class BeneficioRequest : BeneficioBase { }

    public class BeneficioResponse : BeneficioBase
    {
        public Guid BeneficioId { get; set; }
        public DateTime? CreadoEn { get; set; }
        public DateTime? ModificadoEn { get; set; }
        public string? ProveedorNombre { get; set; }
        public string? CategoriaNombre { get; set; }

        public bool EsVigente =>
            string.Equals(Estado, BeneficioEstados.Publicado, StringComparison.OrdinalIgnoreCase) &&
            Disponible &&
            DateTime.UtcNow.Date >= VigenciaInicio.Date &&
            DateTime.UtcNow.Date <= VigenciaFin.Date;
    }

    public class BeneficioDetalle : BeneficioResponse
    {
        public int? VecesSeleccionado { get; set; }
        public int? VouchersEmitidos { get; set; }
        public int? VouchersCanjeados { get; set; }
    }
}

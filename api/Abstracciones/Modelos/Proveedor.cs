using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class ProveedorBase
    {
        [Required, StringLength(200, MinimumLength = 2)]
        public string Nombre { get; set; } = null!;

        [EmailAddress]
        public string? Correo { get; set; }

        [Phone, StringLength(50)]
        public string? Telefono { get; set; }

        [Required]
        public bool Activo { get; set; } = true;

        // Imagen del proveedor (logo o foto)
        public byte[]? Imagen { get; set; }
    }

    public class ProveedorRequest : ProveedorBase
    {
        // Para creación/edición
    }

    public class ProveedorResponse : ProveedorBase
    {
        public Guid ProveedorId { get; set; }
        public DateTime? CreadoEn { get; set; }
        public DateTime? ModificadoEn { get; set; }
    }

    public class ProveedorDetalle : ProveedorResponse
    {
        // Información extendida para cuando se consulta el proveedor
        public string? Direccion { get; set; }
        public int? CantidadBeneficios { get; set; }
    }
}

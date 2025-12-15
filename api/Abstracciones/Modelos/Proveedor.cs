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
        // Imagen del proveedor (logo o foto)
        public byte[]? Imagen { get; set; }
        public string? Direccion { get; set; }
    }

    public class ProveedorRequest : ProveedorBase
    {
        // Para creación/edición
        public string? AccessToken { get; set; }
    }

    public class ProveedorResponse : ProveedorBase
    {
        public Guid ProveedorId { get; set; }
        public string? AccessToken { get; set; }
    }

    public class ProveedorDetalle : ProveedorResponse
    {
        // Información extendida para cuando se consulta el proveedor
        public string? Direccion { get; set; }
        public int? CantidadBeneficios { get; set; }
    }

    public class ProveedorLoginRequest
    {
        public string Token { get; set; } = string.Empty;
    }
}

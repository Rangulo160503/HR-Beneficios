using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Modelos
{
    public class UsuarioBase
    {
        [Required, EmailAddress, StringLength(120)]
        public string Correo { get; set; } = null!;

        [StringLength(120)]
        public string? Nombre { get; set; }

        [RegularExpression(@"^\d{8}$", ErrorMessage = "Teléfono debe tener 8 dígitos")]
        public string? Telefono { get; set; }
    }

    public class UsuarioRequest : UsuarioBase
    {
        [StringLength(255)]
        public string? PasswordHash { get; set; }

        public Guid? ProveedorId { get; set; }
    }

    public class UsuarioResponse : UsuarioBase
    {
        public Guid UsuarioId { get; set; }
        public DateTime FechaRegistro { get; set; }
        public Guid? ProveedorId { get; set; }
    }

    public class UsuarioAsignarProveedorRequest
    {
        [Required]
        public Guid UsuarioId { get; set; }

        public Guid ProveedorId { get; set; }
    }
}

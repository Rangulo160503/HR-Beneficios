using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Modelos
{
    // Lo que comparten request/response
    public class UsuarioBase
    {
        [Required, EmailAddress, StringLength(120)]
        public string Correo { get; set; } = null!;

        [StringLength(120)]
        public string? Nombre { get; set; }

        [RegularExpression(@"^\d{8}$", ErrorMessage = "Teléfono debe tener 8 dígitos")]
        public string? Telefono { get; set; }
    }

    // Crear / Editar
    public class UsuarioRequest : UsuarioBase
    {
        // Opcional: permitir setear password al crear/editar
        [StringLength(255)]
        public string? PasswordHash { get; set; }

        // Opcional al crear: si ya sabés el proveedor
        public Guid? ProveedorId { get; set; }
    }

    // Lo que devuelve la API
    public class UsuarioResponse : UsuarioBase
    {
        public Guid UsuarioId { get; set; }
        public DateTime FechaRegistro { get; set; }
        public Guid? ProveedorId { get; set; }
        // Por seguridad, nunca expongas PasswordHash aquí
    }

    // Para asignar / quitar proveedor (usar en PUT específicos)
    public class UsuarioAsignarProveedorRequest
    {
        [Required]
        public Guid UsuarioId { get; set; }

        // Si viene null, equivale a “quitar proveedor”
        public Guid? ProveedorId { get; set; }
    }
}

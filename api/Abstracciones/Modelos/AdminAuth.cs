using System;
using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class AdminLoginRequest
    {
        [Required, StringLength(50)]
        public string Usuario { get; set; } = null!;

        [Required, StringLength(200)]
        public string Password { get; set; } = null!;
    }

    public class AdminProfile
    {
        public Guid AdminUsuarioId { get; set; }
        public string Usuario { get; set; } = null!;
        public string? Nombre { get; set; }
        public string? Correo { get; set; }
    }

    public class AdminLoginResponse
    {
        public string Token { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
        public AdminProfile Profile { get; set; } = null!;
    }

    public class AdminUsuario : AdminProfile
    {
        public string PasswordHash { get; set; } = null!;
        public bool Activo { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime? UltimoLogin { get; set; }
    }
}

using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Abstracciones.Modelos.Servicios;
using BCrypt.Net;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Flujo
{
    public class AdminAuthFlujo : IAdminAuthFlujo
    {
        private readonly IAdminAuthDA _adminAuthDA;
        private readonly JwtSettings _jwtSettings;

        public AdminAuthFlujo(IAdminAuthDA adminAuthDA, IOptions<JwtSettings> jwtOptions)
        {
            _adminAuthDA = adminAuthDA ?? throw new ArgumentNullException(nameof(adminAuthDA));
            _jwtSettings = jwtOptions.Value ?? throw new ArgumentNullException(nameof(jwtOptions));
        }

        public async Task<AdminLoginResponse?> Login(AdminLoginRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));

            var admin = await _adminAuthDA.ObtenerPorUsuario(request.Usuario);
            if (admin is null)
                return null;

            if (!admin.Activo)
                throw new InactiveAdminException("Usuario inactivo");

            if (string.IsNullOrWhiteSpace(admin.PasswordHash) || !BCrypt.Net.BCrypt.Verify(request.Password, admin.PasswordHash))
                return null;

            var expiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiresMinutes);
            var token = GenerarToken(admin, expiresAt);

            await _adminAuthDA.ActualizarUltimoLogin(admin.AdminUsuarioId);

            return new AdminLoginResponse
            {
                Token = token,
                ExpiresAt = expiresAt,
                Profile = MapearPerfil(admin)
            };
        }

        public async Task<AdminProfile?> ObtenerPerfil(string usuario)
        {
            var admin = await _adminAuthDA.ObtenerPorUsuario(usuario);
            if (admin is null || !admin.Activo)
            {
                return null;
            }

            return MapearPerfil(admin);
        }

        private AdminProfile MapearPerfil(AdminUsuario admin)
            => new()
            {
                AdminUsuarioId = admin.AdminUsuarioId,
                Usuario = admin.Usuario,
                Nombre = admin.Nombre,
                Correo = admin.Correo
            };

        private string GenerarToken(AdminUsuario admin, DateTime expiresAt)
        {
            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, admin.AdminUsuarioId.ToString()),
                new(ClaimTypes.Name, admin.Usuario),
                new("preferred_username", admin.Usuario),
                new(ClaimTypes.Role, "Admin")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expiresAt,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class InactiveAdminException : Exception
    {
        public InactiveAdminException(string message) : base(message)
        {
        }
    }
}
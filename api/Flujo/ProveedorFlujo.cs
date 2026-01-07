using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Abstracciones.Modelos.Servicios;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Flujo
{
    public class ProveedorFlujo : IProveedorFlujo
    {
        private readonly IProveedorDA _proveedorDA;
        private readonly JwtSettings _jwtSettings;

        public ProveedorFlujo(IProveedorDA proveedorDA, IOptions<JwtSettings> jwtOptions)
        {
            _proveedorDA = proveedorDA ?? throw new ArgumentNullException(nameof(proveedorDA));
            _jwtSettings = jwtOptions.Value ?? throw new ArgumentNullException(nameof(jwtOptions));
        }

        public async Task<Guid> Agregar(ProveedorRequest proveedor)
        {
            var id = await _proveedorDA.Agregar(proveedor);
            return id;
        }

        public async Task<Guid> Editar(Guid id, ProveedorRequest proveedor)
        {
            var result = await _proveedorDA.Editar(id, proveedor);
            return result;
        }

        public async Task<Guid> Eliminar(Guid id)
        {
            var result = await _proveedorDA.Eliminar(id);
            return result;
        }

        public async Task<IEnumerable<ProveedorResponse>> Obtener()
        {
            var items = await _proveedorDA.Obtener();
            return items;
        }

        public async Task<ProveedorDetalle> Obtener(Guid id)
        {
            var proveedor = await _proveedorDA.Obtener(id);
            return proveedor;
        }
        public async Task<bool> ExisteProveedor(Guid id)
        {
            var existe = await _proveedorDA.ExisteProveedor(id);
            return existe;
        }

        public async Task<ProveedorDetalle?> ObtenerPorToken(string token)
        {
            var proveedor = await _proveedorDA.ObtenerPorToken(token);
            return proveedor;
        }

        public async Task<ProveedorLoginResponse> LoginPorToken(ProveedorLoginRequest request)
        {
            if (request is null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            if (string.IsNullOrWhiteSpace(request.Token))
            {
                throw new ArgumentException("Token inválido.", nameof(request.Token));
            }

            var proveedor = await _proveedorDA.ObtenerPorToken(request.Token);
            if (proveedor is null || proveedor.ProveedorId == Guid.Empty)
            {
                throw new UnauthorizedAccessException("Token inválido.");
            }

            var expiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiresMinutes);
            var token = GenerarTokenProveedor(proveedor, expiresAt);

            return new ProveedorLoginResponse
            {
                ProveedorId = proveedor.ProveedorId,
                Nombre = proveedor.Nombre ?? string.Empty,
                Role = "Proveedor",
                Access_Token = token,
                Token_Type = "Bearer",
                Expires_At = new DateTimeOffset(expiresAt).ToUnixTimeMilliseconds()
            };
        }

        public async Task<ProveedorSesionResponse?> ValidarSesionProveedor(Guid proveedorId)
        {
            if (proveedorId == Guid.Empty)
            {
                return null;
            }

            var proveedor = await _proveedorDA.Obtener(proveedorId);
            if (proveedor is null || proveedor.ProveedorId == Guid.Empty)
            {
                return null;
            }

            return new ProveedorSesionResponse
            {
                ProveedorId = proveedor.ProveedorId,
                Nombre = proveedor.Nombre ?? string.Empty,
                Role = "Proveedor"
            };
        }

        private string GenerarTokenProveedor(ProveedorDetalle proveedor, DateTime expiresAt)
        {
            var nombre = string.IsNullOrWhiteSpace(proveedor.Nombre)
                ? proveedor.ProveedorId.ToString()
                : proveedor.Nombre;

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, proveedor.ProveedorId.ToString()),
                new(ClaimTypes.Name, nombre),
                new(ClaimTypes.Role, "Proveedor"),
                new("proveedorId", proveedor.ProveedorId.ToString())
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
}

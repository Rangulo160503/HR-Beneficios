using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.Flujo
{
    public interface IAdminAuthFlujo
    {
        Task<AdminLoginResponse?> Login(AdminLoginRequest request);
        Task<AdminProfile?> ObtenerPerfil(string usuario);
    }
}

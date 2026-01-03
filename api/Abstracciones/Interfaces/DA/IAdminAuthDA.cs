using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.DA
{
    public interface IAdminAuthDA
    {
        Task<AdminUsuario?> ObtenerPorUsuario(string usuario);
        Task<Guid> Crear(AdminUsuario adminUsuario);
        Task<int> ActualizarUltimoLogin(Guid adminUsuarioId);
    }
}

using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.DA
{
    public interface IInfoBoardDA
    {
        Task<IEnumerable<InfoBoardItemResponse>> Obtener(bool? activo, string? busqueda);
        Task<InfoBoardItemResponse?> Obtener(Guid id);
        Task<Guid> Agregar(InfoBoardItemRequest item);
        Task<Guid> Editar(Guid id, InfoBoardItemRequest item);
        Task<Guid> Eliminar(Guid id);
    }
}

using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;

namespace Flujo
{
    public class InfoBoardFlujo : IInfoBoardFlujo
    {
        private readonly IInfoBoardDA _infoBoardDA;

        public InfoBoardFlujo(IInfoBoardDA infoBoardDA)
        {
            _infoBoardDA = infoBoardDA ?? throw new ArgumentNullException(nameof(infoBoardDA));
        }

        public async Task<Guid> Agregar(InfoBoardItemRequest item)
        {
            return await _infoBoardDA.Agregar(item);
        }

        public async Task<Guid> Editar(Guid id, InfoBoardItemRequest item)
        {
            return await _infoBoardDA.Editar(id, item);
        }

        public async Task<Guid> Eliminar(Guid id)
        {
            return await _infoBoardDA.Eliminar(id);
        }

        public async Task<IEnumerable<InfoBoardItemResponse>> Obtener(bool? activo, string? busqueda)
        {
            return await _infoBoardDA.Obtener(activo, busqueda);
        }

        public async Task<InfoBoardItemResponse?> Obtener(Guid id)
        {
            return await _infoBoardDA.Obtener(id);
        }
    }
}

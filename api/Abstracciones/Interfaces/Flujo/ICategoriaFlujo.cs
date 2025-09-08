using System.Collections.Generic;
using System.Threading.Tasks;
using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.Flujo
{
    public interface ICategoriaFlujo
    {
        Task<IEnumerable<CategoriaResponse>> Obtener();
        Task<CategoriaDetalle?> Obtener(Guid id);
        Task<Guid> Agregar(CategoriaRequest categoria);
        Task<Guid> Editar(Guid id, CategoriaRequest categoria);
        Task<Guid> Eliminar(Guid id);
        Task<int> Contar();
    }
}

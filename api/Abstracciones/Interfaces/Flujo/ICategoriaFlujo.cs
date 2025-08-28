using System.Collections.Generic;
using System.Threading.Tasks;
using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.Flujo
{
    public interface ICategoriaFlujo
    {
        Task<IEnumerable<CategoriaResponse>> Obtener();
        Task<CategoriaResponse> Obtener(int id);
        Task<int> Agregar(CategoriaRequest categoria);
        Task<int> Editar(int id, CategoriaRequest categoria);
        Task<int> Eliminar(int id);
        Task<int> Contar();
    }
}

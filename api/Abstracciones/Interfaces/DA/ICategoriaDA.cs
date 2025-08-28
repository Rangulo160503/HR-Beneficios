using Abstracciones.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.DA
{
    public interface ICategoriaDA
    {
        Task<IEnumerable<CategoriaResponse>> Obtener();
        Task<CategoriaResponse> Obtener(int id);
        Task<int> Agregar(CategoriaRequest categoria);
        Task<int> Editar(int id, CategoriaRequest categoria);
        Task<int> Eliminar(int id);
        Task<int> Contar();
    }
}

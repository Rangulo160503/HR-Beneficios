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
        Task<CategoriaDetalle?> Obtener(Guid id);
        Task<Guid> Agregar(CategoriaRequest categoria);
        Task<Guid> Editar(Guid id, CategoriaRequest categoria);
        Task<Guid> Eliminar(Guid id);
    }

}

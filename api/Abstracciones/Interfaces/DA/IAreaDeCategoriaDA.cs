using Abstracciones.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.DA
{
    public interface IAreaDeCategoriaDA
    {
        Task<IEnumerable<AreaDeCategoriaResponse>> Obtener();
        Task<AreaDeCategoriaDetalle> Obtener(Guid Id);
        Task<Guid> Agregar(AreaDeCategoriaRequest areacategoria);
        Task<Guid> Editar(Guid Id, AreaDeCategoriaRequest areacategoria);
        Task<Guid> Eliminar(Guid Id);
    }
}

using Abstracciones.Modelos;
using Abstracciones.Modelos.Servicios.Beneficios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.DA
{
    public interface IBeneficioDA
    {
        Task<IEnumerable<BeneficioResponse>> Obtener();
        Task<BeneficioDetalle> Obtener(Guid Id);
        Task<Guid> Agregar(BeneficioRequest beneficio);
        Task<Guid> Editar(Guid Id, BeneficioRequest beneficio);
        Task<Guid> Eliminar(Guid Id);
    }
}

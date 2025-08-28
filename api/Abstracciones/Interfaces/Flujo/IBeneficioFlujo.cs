using Abstracciones.Modelos;
using Abstracciones.Modelos.Servicios.Beneficios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.Flujo
{
    public interface IBeneficioFlujo
    {
        Task<IEnumerable<BeneficioResponse>> Obtener();
        Task<BeneficioDetalle> Obtener(Guid id);
        Task<Guid> Agregar(BeneficioRequest b);
        Task<Guid> Editar(Guid id, BeneficioRequest b);
        Task<Guid> Eliminar(Guid id);
    }
}

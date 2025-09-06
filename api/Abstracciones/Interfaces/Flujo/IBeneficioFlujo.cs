using Abstracciones.Modelos;
using Abstracciones.Modelos.Servicios.Beneficios;
using Microsoft.AspNetCore.Mvc;
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
        Task<BeneficioDetalle> Obtener(Guid Id);
        Task<Guid> Agregar(BeneficioRequest vehiculo);
        Task<Guid> Editar(Guid Id, BeneficioRequest vehiculo);
        Task<Guid> Eliminar(Guid Id);
    }
}

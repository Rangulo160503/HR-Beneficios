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
        Task<IEnumerable<Beneficio>> Obtener();
    }
}

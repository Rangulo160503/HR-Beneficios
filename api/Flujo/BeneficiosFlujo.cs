using Abstracciones.Interfaces.Flujo;
using Abstracciones.Interfaces.Servicios;
using Abstracciones.Modelos.Servicios.Beneficios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Flujo
{
    public class BeneficiosFlujo : IBeneficioFlujo
    {
        private readonly IBeneficiosServicio _beneficiosServicio;
        public BeneficiosFlujo(IBeneficiosServicio beneficiosServicio)
        {
            _beneficiosServicio = beneficiosServicio;
        }
        public async Task<IEnumerable<Beneficio>> Obtener()
        {
            return await _beneficiosServicio.ObtenerBeneficiosAsync();
        }
    }
}

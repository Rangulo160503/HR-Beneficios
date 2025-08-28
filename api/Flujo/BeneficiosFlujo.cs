using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;

namespace Flujo
{
    public class BeneficiosFlujo : IBeneficioFlujo
    {
        private IBeneficioDA _beneficioDA;
        public BeneficiosFlujo(IBeneficioDA beneficioDA)
        {
            _beneficioDA = beneficioDA;
        }

        public async Task<Guid> Agregar(BeneficioRequest beneficio)
        {
            return await _beneficioDA.Agregar(beneficio);
        }

        public async Task<Guid> Editar(Guid id, BeneficioRequest beneficio)
        {
            return await _beneficioDA.Editar(id, beneficio);
        }

        public async Task<Guid> Eliminar(Guid id)
        {
            return await _beneficioDA.Eliminar(id);
        }
        public async Task<IEnumerable<BeneficioResponse>> Obtener()
        {
            return await _beneficioDA.Obtener();
        }
        public async Task<BeneficioDetalle> Obtener(Guid id)
        {
            var beneficio = await _beneficioDA.Obtener(id);
            return beneficio;
        }
    }
}

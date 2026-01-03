using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;

namespace Flujo
{
    public class CategoriaFlujo : ICategoriaFlujo
    {
        private readonly ICategoriaDA _categoriaDA;
        private readonly IBeneficioFlujo _beneficioFlujo;

        public CategoriaFlujo(ICategoriaDA categoriaDA, IBeneficioFlujo beneficioFlujo)
        {
            _categoriaDA = categoriaDA ?? throw new ArgumentNullException(nameof(categoriaDA));
            _beneficioFlujo = beneficioFlujo ?? throw new ArgumentNullException(nameof(beneficioFlujo));
        }

        public async Task<IEnumerable<CategoriaResponse>> Obtener()
        {
            var items = await _categoriaDA.Obtener();
            return items;
        }

        public async Task<CategoriaDetalle> Obtener(Guid id)
        {
            var item = await _categoriaDA.Obtener(id);  // ICategoriaDA.Obtener(Guid) → CategoriaDetalle
            return item ?? new CategoriaDetalle();
        }

        public async Task<Guid> Agregar(CategoriaRequest categoria)
        {
            var id = await _categoriaDA.Agregar(categoria);
            return id;
        }

        public async Task<Guid> Editar(Guid id, CategoriaRequest categoria)
        {
            var result = await _categoriaDA.Editar(id, categoria);
            return result;
        }

        public async Task<Guid> Eliminar(Guid id)
        {
            var asociados = await _beneficioFlujo.ContarPorCategoria(id);
            if (asociados > 0)
                throw new InvalidOperationException("CategoriaEnUso");

            var result = await _categoriaDA.Eliminar(id);
            return result;
        }
    }
}

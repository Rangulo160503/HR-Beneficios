using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace Flujo
{
    public class CategoriaFlujo : ICategoriaFlujo
    {
        private ICategoriaDA _categoriaDA;
        public CategoriaFlujo(ICategoriaDA categoriaDA)
        {
            _categoriaDA = categoriaDA;
        }

        public async Task<Guid> Agregar(CategoriaRequest categoria)
        {
            return await _categoriaDA.Agregar(categoria);
        }

        public async Task<Guid> Editar(Guid id, CategoriaRequest categoria)
        {
            return await _categoriaDA.Editar(id, categoria);
        }

        public async Task<Guid> Eliminar(Guid id)
        {
            return await _categoriaDA.Eliminar(id);
        }

        public async Task<IEnumerable<CategoriaResponse>> Obtener()
        {
            return await _categoriaDA.Obtener();
        }

    }
}   

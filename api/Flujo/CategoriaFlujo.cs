using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Flujo
{
    public class CategoriaFlujo : ICategoriaFlujo
    {
        private ICategoriaDA _categoriaDA;
        public CategoriaFlujo(ICategoriaDA categoriaDA)
        {
            _categoriaDA = categoriaDA;
        }
        public async Task<int> Agregar(CategoriaRequest categoria)
        {
            return await _categoriaDA.Agregar(categoria);
        }
        public async Task<int> Editar(int id, CategoriaRequest categoria)
        {
            return await _categoriaDA.Editar(id, categoria);
        }
        public async Task<int> Eliminar(int id)
        {
            return await _categoriaDA.Eliminar(id);
        }
        public async Task<IEnumerable<CategoriaResponse>> Obtener()
        {
            return await _categoriaDA.Obtener();
        }
        public async Task<CategoriaResponse> Obtener(int id)
        {
            var categoria = await _categoriaDA.Obtener(id);
            return categoria;
        }
        public async Task<int> Contar()
        {
            return await _categoriaDA.Contar();
        }
    }
}

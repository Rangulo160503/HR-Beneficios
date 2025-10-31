using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.API
{
    public interface IProductoController
    {
        Task<IActionResult> Obtener();                              // GET: api/producto
        Task<IActionResult> Obtener(Guid Id);                       // GET: api/producto/{id}
        Task<IActionResult> Agregar(Producto producto);              // POST: api/producto
        Task<IActionResult> Editar(Guid Id, Producto producto);      // PUT: api/producto/{id}
        Task<IActionResult> Eliminar(Guid Id);                       // DELETE: api/producto/{id}
    }
}

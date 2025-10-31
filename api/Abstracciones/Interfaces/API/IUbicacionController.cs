using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.API
{
    public interface IUbicacionController
    {
        Task<IActionResult> Obtener();                              // GET: api/ubicacion
        Task<IActionResult> Obtener(Guid Id);                       // GET: api/ubicacion/{id}
        Task<IActionResult> Agregar(Ubicacion ubicacion);            // POST: api/ubicacion
        Task<IActionResult> Editar(Guid Id, Ubicacion ubicacion);    // PUT: api/ubicacion/{id}
        Task<IActionResult> Eliminar(Guid Id);                       // DELETE: api/ubicacion/{id}
    }
}

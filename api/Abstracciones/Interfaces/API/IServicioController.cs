using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.API
{
    public interface IServicioController
    {
        Task<IActionResult> Obtener();                              // GET: api/servicio
        Task<IActionResult> Obtener(Guid Id);                       // GET: api/servicio/{id}
        Task<IActionResult> Agregar(Servicio servicio);              // POST: api/servicio
        Task<IActionResult> Editar(Guid Id, Servicio servicio);      // PUT: api/servicio/{id}
        Task<IActionResult> Eliminar(Guid Id);                       // DELETE: api/servicio/{id}
    }
}

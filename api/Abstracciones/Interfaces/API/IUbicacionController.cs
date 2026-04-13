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
        Task<IActionResult> Obtener();
        Task<IActionResult> Obtener(Guid Id);
        Task<IActionResult> Agregar(Ubicacion ubicacion);
        Task<IActionResult> Editar(Guid Id, Ubicacion ubicacion);
        Task<IActionResult> Eliminar(Guid Id);
    }
}

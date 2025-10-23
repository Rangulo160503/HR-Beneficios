using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.API
{
    public interface IAreaDeCategoriaController
    {
        Task<IActionResult> Obtener();
        Task<IActionResult> Obtener(Guid Id);
        Task<IActionResult> Agregar(AreaDeCategoriaRequest areacategoria);
        Task<IActionResult> Editar(Guid Id, AreaDeCategoriaRequest areacategoria);
        Task<IActionResult> Eliminar(Guid Id);
    }
}

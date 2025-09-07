using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace Abstracciones.Interfaces.API
{
    public interface ICategoriaController
    {
        Task<IActionResult> Obtener();
        Task<IActionResult> Obtener(Guid Id);
        Task<IActionResult> Agregar(CategoriaRequest categoria);
        Task<IActionResult> Editar(Guid Id, CategoriaRequest categoria);
        Task<IActionResult> Eliminar(Guid Id);
    }
}

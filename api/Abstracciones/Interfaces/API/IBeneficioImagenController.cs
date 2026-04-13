using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.API
{
    public interface IBeneficioImagenController
    {
        Task<IActionResult> Obtener(Guid beneficioId);

        Task<IActionResult> ObtenerPorId(Guid imagenId);

        Task<IActionResult> Agregar(BeneficioImagenRequest beneficioImagen);

        Task<IActionResult> Editar(Guid imagenId, BeneficioImagenRequest beneficioImagen);

        Task<IActionResult> Eliminar(Guid imagenId);
    }
}

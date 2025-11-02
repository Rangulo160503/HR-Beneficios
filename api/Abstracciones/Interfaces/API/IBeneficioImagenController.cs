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
        //  Obtiene todas las imágenes de un beneficio
        Task<IActionResult> Obtener(Guid beneficioId);

        //  Obtiene una imagen específica por su Id
        Task<IActionResult> ObtenerPorId(Guid imagenId);

        //  Agrega una nueva imagen al beneficio
        Task<IActionResult> Agregar(BeneficioImagenRequest beneficioImagen);

        //  Edita una imagen existente
        Task<IActionResult> Editar(Guid imagenId, BeneficioImagenRequest beneficioImagen);

        //  Elimina una imagen del beneficio
        Task<IActionResult> Eliminar(Guid imagenId);
    }
}

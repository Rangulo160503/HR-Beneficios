using Abstracciones.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.Flujo
{
    public interface IBeneficioImagenFlujo
    {
        //  Obtiene todas las imágenes asociadas a un beneficio
        Task<IEnumerable<BeneficioImagenResponse>> Obtener(Guid beneficioId);

        //  Obtiene el detalle de una imagen específica
        Task<BeneficioImagenDetalle?> ObtenerPorId(Guid imagenId);

        //  Agrega una nueva imagen al beneficio
        Task<Guid> Agregar(BeneficioImagenRequest beneficioImagen);

        //  Edita una imagen existente
        Task<Guid> Editar(Guid imagenId, BeneficioImagenRequest beneficioImagen);

        //  Elimina una imagen del beneficio
        Task<Guid> Eliminar(Guid imagenId);
    }
}

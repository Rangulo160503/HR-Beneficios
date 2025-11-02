using Abstracciones.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.DA
{
    public interface IBeneficioImagenDA
    {
        //  Obtiene todas las imágenes de un beneficio específico
        Task<IEnumerable<BeneficioImagenResponse>> Obtener(Guid BeneficioId);

        //  Obtiene una imagen específica por su Id (detalle individual)
        Task<BeneficioImagenDetalle> ObtenerPorId(Guid ImagenId);

        //  Agrega una nueva imagen al beneficio
        Task<Guid> Agregar(BeneficioImagenRequest beneficioImagen);

        //  Edita una imagen existente
        Task<Guid> Editar(Guid ImagenId, BeneficioImagenRequest beneficioImagen);

        //  Elimina una imagen del beneficio
        Task<Guid> Eliminar(Guid ImagenId);
    }
}

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
        Task<IEnumerable<BeneficioImagenResponse>> Obtener(Guid beneficioId);

        Task<BeneficioImagenDetalle?> ObtenerPorId(Guid imagenId);

        Task<Guid> Agregar(BeneficioImagenRequest beneficioImagen);

        Task<Guid> Editar(Guid imagenId, BeneficioImagenRequest beneficioImagen);

        Task<Guid> Eliminar(Guid imagenId);
    }
}

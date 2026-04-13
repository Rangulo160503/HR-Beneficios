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
        Task<IEnumerable<BeneficioImagenResponse>> Obtener(Guid BeneficioId);

        Task<BeneficioImagenDetalle> ObtenerPorId(Guid ImagenId);

        Task<Guid> Agregar(BeneficioImagenRequest beneficioImagen);

        Task<Guid> Editar(Guid ImagenId, BeneficioImagenRequest beneficioImagen);

        Task<Guid> Eliminar(Guid ImagenId);
    }
}

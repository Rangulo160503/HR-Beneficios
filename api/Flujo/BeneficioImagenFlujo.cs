using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Flujo
{
    public class BeneficioImagenFlujo : IBeneficioImagenFlujo
    {
        private readonly IBeneficioImagenDA _beneficioImagenDA;

        public BeneficioImagenFlujo(IBeneficioImagenDA beneficioImagenDA)
        {
            _beneficioImagenDA = beneficioImagenDA ?? throw new ArgumentNullException(nameof(beneficioImagenDA));
        }

        public async Task<IEnumerable<BeneficioImagenResponse>> Obtener(Guid beneficioId)
        {
            if (beneficioId == Guid.Empty)
                throw new ArgumentException("El ID del beneficio no puede estar vacío.", nameof(beneficioId));

            var items = await _beneficioImagenDA.Obtener(beneficioId);
            return items;
        }

        public async Task<BeneficioImagenDetalle?> ObtenerPorId(Guid imagenId)
        {
            if (imagenId == Guid.Empty)
                throw new ArgumentException("El ID de la imagen no puede estar vacío.", nameof(imagenId));

            var item = await _beneficioImagenDA.ObtenerPorId(imagenId);
            return item ?? new BeneficioImagenDetalle();
        }

        public async Task<Guid> Agregar(BeneficioImagenRequest beneficioImagen)
        {
            if (beneficioImagen is null)
                throw new ArgumentNullException(nameof(beneficioImagen));

            if (beneficioImagen.BeneficioId == Guid.Empty)
                throw new ArgumentException("El ID del beneficio es obligatorio.", nameof(beneficioImagen.BeneficioId));

            var id = await _beneficioImagenDA.Agregar(beneficioImagen);
            return id;
        }

        public async Task<Guid> Editar(Guid imagenId, BeneficioImagenRequest beneficioImagen)
        {
            if (imagenId == Guid.Empty)
                throw new ArgumentException("El ID de la imagen es obligatorio.", nameof(imagenId));

            if (beneficioImagen is null)
                throw new ArgumentNullException(nameof(beneficioImagen));

            var result = await _beneficioImagenDA.Editar(imagenId, beneficioImagen);
            return result;
        }

        public async Task<Guid> Eliminar(Guid imagenId)
        {
            if (imagenId == Guid.Empty)
                throw new ArgumentException("El ID de la imagen es obligatorio.", nameof(imagenId));

            var result = await _beneficioImagenDA.Eliminar(imagenId);
            return result;
        }
    }
}

using System;

namespace Reglas.Excepciones
{
    public class CategoriaEnUsoException : Exception
    {
        public Guid CategoriaId { get; }
        public int BeneficiosCount { get; }

        public CategoriaEnUsoException(Guid categoriaId, int beneficiosCount, string? message = null, Exception? innerException = null)
            : base(message ?? "La categoría tiene beneficios asociados.", innerException)
        {
            CategoriaId = categoriaId;
            BeneficiosCount = beneficiosCount;
        }
    }
}

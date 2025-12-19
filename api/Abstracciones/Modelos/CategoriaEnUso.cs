using System;

namespace Abstracciones.Modelos
{
    public class CategoriaEnUsoResponse
    {
        public string Code { get; set; } = "CategoriaEnUso";
        public string Message { get; set; } = "La categoría tiene beneficios asociados.";
        public Guid CategoriaId { get; set; }
        
        public int Count { get; set; }
    }

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

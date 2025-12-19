using System;
using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class CategoriaBase
    {
        [Required, StringLength(200, MinimumLength = 3)]
        public string Nombre { get; set; } = null!;
    }

    public class CategoriaRequest : CategoriaBase
    {
        // Para creación/edición
    }

    public class CategoriaResponse : CategoriaBase
    {
        public Guid CategoriaId { get; set; }
    }

    public class CategoriaDetalle : CategoriaResponse
    {
        // Datos descriptivos opcionales
        
    }

    public class CategoriaEnUsoResponse : CategoriaResponse
    {
        public string Code { get; set; } = "CategoriaEnUso";
        public string Message { get; set; } = "La categoría tiene beneficios asociados.";
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

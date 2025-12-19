namespace Abstracciones.Modelos
{
    /// <summary>
    /// Representa un registro devuelto por core.ObtenerBeneficiosPorCategoria que incluye el total paginado.
    /// </summary>
    public class BeneficioPorCategoriaRow : BeneficioResponse
    {
        public int Total { get; set; }
    }
}

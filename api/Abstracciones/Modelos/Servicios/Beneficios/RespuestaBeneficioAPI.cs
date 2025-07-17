using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Modelos.Servicios.Beneficios
{
    public class RespuestaBeneficioAPI
    {
        public List<ItemBeneficioAPI> Items { get; set; } = new();
    }

    public class ItemBeneficioAPI
    {
        public string Id { get; set; } = string.Empty;
        public string Titulo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string ImagenUrl { get; set; } = string.Empty;
        public string Proveedor { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public string Moneda { get; set; } = string.Empty;
        public string Vigencia { get; set; } = string.Empty;
        public string Condiciones { get; set; } = string.Empty;
        public string CodigoQrUrl { get; set; } = string.Empty;
        public bool Disponible { get; set; }
    }
}

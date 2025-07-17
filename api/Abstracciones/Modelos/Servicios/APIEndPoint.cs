using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Modelos.Servicios
{
    public class APIEndPoint
    {
        public string? UrlBase { get; set; }
        public IEnumerable<Metodo> Metodos { get; set; } = new List<Metodo>();
    }

    public class Metodo
    {
        public string Nombre { get; set; } = string.Empty;
        public string Valor { get; set; } = string.Empty;
    }
}

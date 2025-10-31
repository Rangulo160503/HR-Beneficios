using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Modelos
{
    public class Ubicacion
    {
        public Guid UbicacionId { get; set; }         // GUID PK
        public string Provincia { get; set; } = string.Empty;
        public string? Canton { get; set; }
        public string? Distrito { get; set; }
        public string? DireccionExacta { get; set; }
        public DateTime CreadoEn { get; set; }
        public DateTime? ModificadoEn { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Modelos
{
    public class Servicio
    {
        public Guid ServicioId { get; set; }          // GUID PK
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public DateTime CreadoEn { get; set; }
        public DateTime? ModificadoEn { get; set; }
    }
}

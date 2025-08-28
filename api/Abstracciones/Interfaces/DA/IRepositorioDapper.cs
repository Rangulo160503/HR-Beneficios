using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.DA
{
    public interface IRepositorioDapper
    {
        IDbConnection ObtenerRepositorio();
    }
}

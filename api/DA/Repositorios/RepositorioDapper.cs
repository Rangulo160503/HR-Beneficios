using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Reglas;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DA.Repositorios
{
    public class RepositorioDapper : IRepositorioDapper
    {
        private readonly IConfiguration _configuracion;
        private readonly IDbConnection _conexionBaseDatos;

        public RepositorioDapper(IConfiguration configuracion)
        {
            _configuracion = configuracion ?? throw new ArgumentNullException(nameof(configuracion));
            var connectionString = _configuracion["ConnectionStrings:BD"];

            if (string.IsNullOrWhiteSpace(connectionString))
                throw new ArgumentException("Connection string 'BD' no puede ser nulo o vacío", nameof(connectionString));

            _conexionBaseDatos = new SqlConnection(connectionString);
        }

        public IDbConnection ObtenerRepositorio()
        {
            return _conexionBaseDatos;
        }
    }
}

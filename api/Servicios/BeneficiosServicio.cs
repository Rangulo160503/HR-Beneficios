using Abstracciones.Interfaces.Reglas;
using Abstracciones.Interfaces.Servicios;
using Abstracciones.Modelos.Servicios.Beneficios;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Servicios
{
    public class BeneficiosServicio : IBeneficiosServicio
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguracion _configuracion;

        public BeneficiosServicio(IHttpClientFactory httpClientFactory, IConfiguracion configuracion)
        {
            _httpClientFactory = httpClientFactory;
            _configuracion = configuracion;
        }

        public async Task<IEnumerable<Beneficio>> ObtenerBeneficiosAsync()
        {
            var endpoint = _configuracion.ObtenerMetodo("ApiEndPointsBeneficio", "ListadoBeneficio");

            var cliente = _httpClientFactory.CreateClient("ServicioBeneficio");
            cliente.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var respuesta = await cliente.GetAsync(endpoint);
            respuesta.EnsureSuccessStatusCode();

            var contenido = await respuesta.Content.ReadAsStringAsync();
            var opciones = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var resultado = JsonSerializer.Deserialize<List<Beneficio>>(contenido, opciones);

            return resultado ?? new List<Beneficio>();
        }
    }
}

export async function submitContacto({ contactoGateway, url, dto, options } = {}) {
  if (!url) throw new Error("Contacto URL requerida");
  return contactoGateway.submit(url, dto, options);
}

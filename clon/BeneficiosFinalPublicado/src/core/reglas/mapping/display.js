// Mapping de vista para BeneficiosFinalPublicado (client)
import { extractImage, EMBED_PLACEHOLDER } from "../../../utils/images";

export function mapBenefit(b) {
  const id = b.beneficioId ?? b.BeneficioId ?? b.id ?? b.Id;
  const titulo = b.titulo ?? b.Titulo ?? b.nombre ?? b.Nombre ?? "Beneficio";
  const proveedor =
    b.proveedorNombre ?? b.ProveedorNombre ?? b.proveedor ?? b.Proveedor ?? "Proveedor";
  const categoria = b.categoriaNombre ?? b.CategoriaNombre ?? b.categoria ?? b.Categoria ?? null;

  let descuento = b.descuento ?? b.Descuento ?? b.porcentaje ?? b.Porcentaje ?? null;
  if (typeof descuento === "number") descuento = `${descuento > 0 ? "-" : ""}${Math.abs(descuento)}%`;
  if (typeof descuento === "string" && descuento && !descuento.includes("%")) descuento = `${descuento}%`;

  const destacado = !!(b.destacado ?? b.Destacado);

  return {
    id,
    titulo,
    proveedor,
    categoria,
    descuento: descuento || null,
    destacado,
    imagen: extractImage(b) || EMBED_PLACEHOLDER,
  };
}

export function mapCategoria(c) {
  return {
    id: c.categoriaId ?? c.CategoriaId ?? c.id ?? c.Id,
    nombre: c.nombre ?? c.Nombre ?? c.titulo ?? c.Titulo ?? "Categoría",
  };
}

export function mapProveedor(p) {
  return {
    id: p.proveedorId ?? p.ProveedorId ?? p.id ?? p.Id,
    nombre: p.nombre ?? p.Nombre ?? p.titulo ?? p.Titulo ?? "Proveedor",
  };
}

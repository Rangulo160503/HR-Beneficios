# Checklist de creación BD Beneficios

## 0) Preparación
- [ ] DB creada (nombre + collation).
- [ ] Esquemas `core`, `ops`, `rep` listos.
- [ ] Estados definidos (enum o catálogos).
- [ ] Reglas/tipos comunes acordados.

## 1) Catálogos
- [ ] `core.Categoria` creada.
- [ ] `core.Proveedor` creado.
- [ ] Nombres únicos + `Activo`.
- [ ] Seeds mínimos cargados.

## 2) Núcleo
- [ ] `core.Beneficio` creado (FK a Proveedor/Categoría).
- [ ] Precio ≥ 0; vigencia válida.
- [ ] Estados operativos; placeholder de imagen.

## 3) Usuarios y selección
- [ ] `core.Usuario` creado (correo único).
- [ ] `core.SeleccionBeneficio` creado (FKs).
- [ ] De-dupe de selección (ventana corta).

## 4) Interacciones
- [ ] `core.InteraccionBeneficio` creado.
- [ ] `UsuarioId` opcional; `BeneficioId` obligatorio.
- [ ] Taxonomía fijada; de-dupe de `view`.

## 5) Ingesta por correo
- [ ] `ops.InboxBeneficios` creado.
- [ ] Guarda correo crudo + estado + motivo.
- [ ] Crea borradores de Beneficio; idempotencia.

## 6) Canje
- [ ] `core.ProveedorPunto` creado.
- [ ] `core.Voucher` creado (código único, 1:1 selección).
- [ ] `core.DispositivoScanner` (si aplica).
- [ ] `core.EventoCanje` creado (resultado + motivo).
- [ ] Canje idempotente verificado.

## 7) Métricas
- [ ] `rep.MetricaBeneficioDiaria` (PK Fecha+Id).
- [ ] Proveedor/Categoría/Canje (si aplica) con PK compuesta.
- [ ] Job diario + retención crudo definida.

## 8) Soporte/seguridad
- [ ] Bitácora/auditoría clave.
- [ ] Vistas de conveniencia listas.
- [ ] Permisos/roles aplicados.

## Migraciones (cada lote)
- [ ] Objetos → constraints → índices → seeds.
- [ ] Una migración = una responsabilidad.
- [ ] Carpetas `V1_00…V1_60` creadas.

## MVP rápido (orden de despliegue)
- [ ] Catálogos + Beneficio.
- [ ] Usuario + Selección.
- [ ] Interacciones.
- [ ] Inbox (luego).
- [ ] Canje + Métricas (más tarde).

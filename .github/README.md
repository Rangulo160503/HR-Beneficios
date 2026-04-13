# HR-Beneficios

## Arquitectura del sistema

<p align="center">
  <img src="HR.drawio.svg" width="100%" />
</p>

## Documentación por módulos

El proyecto está documentado de forma modular. Cada componente contiene su propio README con detalles técnicos y de ejecución.

### Backend

* `api/README.md` → API principal, lógica de negocio y acceso a datos

### Base de datos

* `BD/README.md` → scripts SQL, estructura y seeds iniciales

### Herramientas

* `tools/README.md` → utilidades del proyecto
* `tools/HashGenerator/README.md` → generación de hashes BCrypt

### Frontend (desarrollo - Vite)

* `clon/AdminBeneficiosFinalPublicado/README.md` → portal de administración
* `clon/BeneficiosFinalPublicado/README.md` → portal de colaboradores
* `clon/ProveedorBeneficiosFinalPublicado/README.md` → portal de proveedores
* `clon/InicioBeneficiosFinalPublicado/README.md` → landing principal

### Frontend (despliegue / hosts ASP.NET)

* `webAdmin/README.md` → host del portal admin
* `webClient/README.md` → host del portal de colaboradores
* `webProveedor/README.md` → host del portal de proveedores
* `webInicio/README.md` → host del landing
* `web/README.md` → artefacto no ejecutable directamente (ver detalles internos)

### Configuración

* `.github/README.md` → configuración de repositorio (actualmente sin workflows)

## Flujo general del sistema

1. El usuario accede a un frontend (Admin, Proveedor o Cliente)
2. El frontend consume la API mediante endpoints `/api/...`
3. La API procesa la solicitud (lógica de negocio)
4. Se accede a la base de datos mediante procedimientos almacenados
5. La respuesta se devuelve al frontend

## Consideraciones importantes

* La API y los frontends deben estar alineados en el mismo endpoint base (`API_BASE`)
* Existen diferencias entre entorno de desarrollo (Vite proxy) y despliegue (ASP.NET host)
* El módulo `web/` no es ejecutable directamente (solo artefactos generados)
* El portal de proveedor utiliza configuración directa de API (no proxy)

## Inicio rápido

1. Ejecutar base de datos (`BD/README.md`)
2. Levantar API (`api/README.md`)
3. Ejecutar frontend desde `clon/` según módulo

## Modelo de datos

```mermaid
erDiagram
    AreaDeCategoria {
        guid AreaDeCategoriaId PK
        string Nombre
    }
    Categoria {
        guid CategoriaId PK
        string Nombre
        guid AreaDeCategoriaId FK
    }
    Proveedor {
        guid ProveedorId PK
        string Nombre
        string Correo
        string Telefono
        string Direccion
        string AccessToken
    }
    Beneficio {
        guid BeneficioId PK
        string Titulo
        decimal PrecioCRC
        date VigenciaInicio
        date VigenciaFin
        bool Disponible
        string Origen
        datetime CreadoEn
        datetime ModificadoEn
        binary Imagen
        guid CategoriaId FK
        guid ProveedorId FK
        int Estado
        datetime FechaCreacion
        datetime FechaAprobacion
        guid AprobadoPorUsuarioId
        bool PrecioDesde
    }
    BeneficioImagen {
        guid ImagenId PK
        guid BeneficioId FK
        binary Imagen
        int Orden
        datetime CreadoEn
        datetime ModificadoEn
    }
    Usuario {
        guid UsuarioId PK
        string Correo
        string Nombre
        string Telefono
        datetime FechaRegistro
        string PasswordHash
        string Tipo
        int Estado
    }
    tbAdminUsuario {
        guid AdminUsuarioId PK
        string Usuario
        string Nombre
        string Correo
        string PasswordHash
        bool Activo
        datetime FechaCreacion
        datetime UltimoLogin
    }
    ProveedorUsuario {
        guid ProveedorId PK_FK
        guid UsuarioId PK_FK
        string Rol
        datetime FechaAsignacion
    }
    SeleccionBeneficio {
        int SeleccionId PK
        int UsuarioId
        guid BeneficioId FK
        datetime FechaSeleccion
        string Origen
    }
    ToqueBeneficio {
        guid ToqueBeneficioId PK
        guid BeneficioId
        datetime Fecha
        string Origen
    }
    InfoBoardItem {
        guid InfoBoardItemId PK
        string Titulo
        string Descripcion
        string Url
        string Tipo
        int Prioridad
        bool Activo
        datetime FechaInicio
        datetime FechaFin
        datetime CreatedAt
        datetime UpdatedAt
        bool IsDeleted
    }
    RifaParticipacion {
        guid Id PK
        string Source
        string Estado
        datetime FechaCreacion
        string Nombre
        string Correo
        string Telefono
        string Mensaje
    }
    Producto {
        guid ProductoId PK
        string Nombre
        string Descripcion
        datetime CreadoEn
        datetime ModificadoEn
    }
    Servicio {
        guid ServicioId PK
        string Nombre
        string Descripcion
        datetime CreadoEn
        datetime ModificadoEn
    }
    Ubicacion {
        guid UbicacionId PK
        string Provincia
        string Canton
        string Distrito
        string DireccionExacta
        datetime CreadoEn
        datetime ModificadoEn
    }
    CategoriaIdMap {
        int CategoriaIdInt PK
        guid CategoriaIdGuid
    }
    AreaDeCategoria ||--o{ Categoria : "FK_Categoria_AreaDeCategoria"
    Categoria ||--o{ Beneficio : "FK_Beneficio_Categoria"
    Proveedor ||--o{ Beneficio : "FK_Beneficio_Proveedor"
    Beneficio ||--o{ BeneficioImagen : "FK_BeneficioImagen_Beneficio"
    Proveedor ||--o{ ProveedorUsuario : "FK_ProvUser_Proveedor"
    Usuario ||--o{ ProveedorUsuario : "FK_ProvUser_Usuario"
    Beneficio ||--o{ SeleccionBeneficio : "FK_SeleccionBeneficio_BeneficioId"
```

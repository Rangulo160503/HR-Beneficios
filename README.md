# 📚 Modelo de Datos – Beneficios-PR

Este proyecto contiene la base de datos y módulos para la gestión de beneficios.  
A continuación se muestra el diagrama entidad–relación (ERD) en **Mermaid**:

```mermaid
erDiagram
    BENEFICIO {
      int BeneficioId PK
      string Titulo
      string Descripcion
      decimal PrecioCRC
      int ProveedorId FK
      int CategoriaId FK
      string ImagenUrl
      string Condiciones
      date VigenciaInicio
      date VigenciaFin
      enum Estado  "Borrador|Publicado|Inactivo|Archivado"
      bool Disponible
      enum Origen  "manual|email"
      datetime CreadoEn
      datetime ModificadoEn
    }

    PROVEEDOR {
      int ProveedorId PK
      string Nombre
      string Correo
      string Telefono
      bool Activo
      datetime CreadoEn
      datetime ModificadoEn
    }

    CATEGORIA {
      int CategoriaId PK
      string Nombre
      bool Activa
      datetime CreadoEn
      datetime ModificadoEn
    }

    USUARIO {
      int UsuarioId PK
      string Correo  "único"
      string Nombre
      string Telefono  "8 dígitos"
      datetime FechaRegistro
    }

    SELECCION_BENEFICIO {
      int SeleccionId PK
      int UsuarioId FK
      int BeneficioId FK
      datetime FechaSeleccion
      enum Origen  "Web|App|Email"
    }

    INTERACCION_BENEFICIO {
      int InteraccionId PK
      int BeneficioId FK
      int UsuarioId FK "opcional"
      datetime Fecha
      enum TipoInteraccion "view|detail_open|click|select|attempt_use|attempt_use_inactive"
      string Origen
      string SesionId
      json Contexto
    }

    VOUCHER {
      int VoucherId PK
      int UsuarioId FK
      int BeneficioId FK
      int SeleccionId FK "opcional"
      string Codigo  "único / QR"
      enum Estado "Emitido|Canjeado|Expirado|Revocado"
      datetime FechaEmision
      datetime FechaExpira
      datetime CanjeadoEn
      int ProveedorPuntoId FK "opcional"
      string Origen
      json Metadata
    }

    PROVEEDOR_PUNTO {
      int ProveedorPuntoId PK
      int ProveedorId FK
      string NombrePunto
      string Ubicacion
      bool Activo
    }

    DISPOSITIVO_SCANNER {
      int DispositivoId PK
      int ProveedorPuntoId FK
      string Nombre
      string ApiKey
      bool Activo
    }

    EVENTO_CANJE {
      int EventoId PK
      int VoucherId FK
      int DispositivoId FK "opcional"
      datetime Fecha
      enum Resultado "Aprobado|Rechazado"
      string Motivo
      json Snapshot
    }

    INBOX_BENEFICIOS {
      int InboxId PK
      string Remitente
      string Asunto
      string Cuerpo
      datetime FechaRecepcion
      string AdjuntosRef
      enum EstadoProcesamiento "Pendiente|Procesado|Error"
      string MotivoError
    }

    METRICA_BENEFICIO_DIARIA {
      date Fecha PK
      int BeneficioId FK
      int views
      int detail_opens
      int clicks
      int selects
      int attempts_use
      int attempts_use_inactive
    }

    METRICA_PROVEEDOR_DIARIA {
      date Fecha PK
      int ProveedorId FK
      int views
      int clicks
      int selects
    }

    METRICA_CATEGORIA_DIARIA {
      date Fecha PK
      int CategoriaId FK
      int views
      int clicks
      int selects
    }

    METRICA_CANJE_DIARIA {
      date Fecha PK
      int BeneficioId FK
      int emitidos
      int canjeados
      int rechazados
    }

    %% Relaciones principales
    PROVEEDOR ||--o{ BENEFICIO : "proporciona"
    CATEGORIA ||--o{ BENEFICIO : "clasifica"

    USUARIO  ||--o{ SELECCION_BENEFICIO : "realiza"
    BENEFICIO||--o{ SELECCION_BENEFICIO : "es_seleccionado_en"

    BENEFICIO||--o{ INTERACCION_BENEFICIO : "genera"
    USUARIO  |o--o{ INTERACCION_BENEFICIO : "asocia"

    USUARIO  ||--o{ VOUCHER : "recibe"
    BENEFICIO||--o{ VOUCHER : "de"
    PROVEEDOR_PUNTO |o--o{ VOUCHER : "canjea_en"

    VOUCHER ||--o{ EVENTO_CANJE : "registra"
    PROVEEDOR_PUNTO ||--o{ DISPOSITIVO_SCANNER : "tiene"
    DISPOSITIVO_SCANNER |o--o{ EVENTO_CANJE : "captura"

    INBOX_BENEFICIOS ||--o{ BENEFICIO : "origina_borrador"

    PROVEEDOR ||--o{ PROVEEDOR_PUNTO : "opera"

    %% Agregados (métricas)
    BENEFICIO ||--o{ METRICA_BENEFICIO_DIARIA : "agrega"
    PROVEEDOR ||--o{ METRICA_PROVEEDOR_DIARIA : "agrega"
    CATEGORIA ||--o{ METRICA_CATEGORIA_DIARIA : "agrega"
    BENEFICIO ||--o{ METRICA_CANJE_DIARIA : "agrega"

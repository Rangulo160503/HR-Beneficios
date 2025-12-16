/* Seed de administradores iniciales */
INSERT INTO core.tbAdminUsuario (AdminUsuarioId, Usuario, Nombre, Correo, PasswordHash, Activo)
SELECT TOP 1 NEWSEQUENTIALID(), 'admin', 'Administrador', 'admin@hrbeneficios.local',
       '$2y$12$JBwjYdoeb2x.iSpYV06QNebjXtRMOuF3wnu2E.0FXF722WC1tdXCq', 1
WHERE NOT EXISTS (SELECT 1 FROM core.tbAdminUsuario WHERE Usuario = 'admin');
GO

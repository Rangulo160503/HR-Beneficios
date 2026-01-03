// src/pages/ProveedorPortal/ProveedorPerfilPage/usePerfilFormState.js

import { useState } from "react";

export default function usePerfilFormState() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    telefono: "",
    correo: "",
    logo: "",
  });

  return { form, setForm };
}

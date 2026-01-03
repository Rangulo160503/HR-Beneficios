import { useState } from "react";

const MAX_IMAGE_SIZE_BYTES = 1024 * 1024; // 1 MB

export default function useProveedorBeneficioFormState() {
  const [titulo, setTitulo] = useState("");
  const [precioCRC, setPrecioCRC] = useState("");
  const [moneda, setMoneda] = useState("CRC");
  const [categoriaId, setCategoriaId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [condiciones, setCondiciones] = useState("");
  const [vigenciaInicio, setVigenciaInicio] = useState("");
  const [vigenciaFin, setVigenciaFin] = useState("");
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [errorImagen, setErrorImagen] = useState("");

  // Por ahora mock; luego lo traemos de la API
  const categoriasMock = [
    { id: 1, nombre: "Odontología" },
    { id: 2, nombre: "Salud" },
    { id: 3, nombre: "Bienestar" },
  ];

  const handleImagenChange = (file) => {
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setErrorImagen("La imagen no puede superar 1 MB.");
      setImagenFile(null);
      setImagenPreview(null);
      return;
    }

    setErrorImagen("");
    setImagenFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => setImagenPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setTitulo("");
    setPrecioCRC("");
    setMoneda("CRC");
    setCategoriaId("");
    setDescripcion("");
    setCondiciones("");
    setVigenciaInicio("");
    setVigenciaFin("");
    setImagenFile(null);
    setImagenPreview(null);
    setErrorImagen("");
  };

  const getPayload = () => ({
    titulo,
    precioCRC,
    moneda,
    categoriaId,
    descripcion,
    condiciones,
    vigenciaInicio,
    vigenciaFin,
    imagenFile,
  });

  return {
    // state
    titulo,
    precioCRC,
    moneda,
    categoriaId,
    descripcion,
    condiciones,
    vigenciaInicio,
    vigenciaFin,
    imagenFile,
    imagenPreview,
    errorImagen,
    categoriasMock,
    // setters
    setTitulo,
    setPrecioCRC,
    setMoneda,
    setCategoriaId,
    setDescripcion,
    setCondiciones,
    setVigenciaInicio,
    setVigenciaFin,
    // helpers
    handleImagenChange,
    resetForm,
    getPayload,
  };
}

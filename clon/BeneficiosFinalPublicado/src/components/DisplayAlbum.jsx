import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { PlayerContext } from "../context/PlayerContext";
import { fetchBeneficios } from "../services/beneficiosService";

const DisplayAlbum = () => {
  const { id } = useParams();
  const [beneficios, setBeneficios] = useState([]);
  const { playWithId } = useContext(PlayerContext);

  useEffect(() => {
    const cargarDatos = async () => {
      const data = await fetchBeneficios();
      setBeneficios(data);
    };

    cargarDatos();
  }, []);

  const beneficioPrincipal = beneficios[id]; // asume que id es el índice

  if (!beneficioPrincipal) return <div className="p-4 text-white">Cargando...</div>;

  return (
    <div>
      <Navbar />
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end px-4">
        <img className="w-48 rounded" src={beneficioPrincipal.imagenUrl} alt="" />
        <div className="flex flex-col">
          <p>Catálogo</p>
          <h2 className="text-5xl font-bold mb-4 md:text-7xl">{beneficioPrincipal.titulo}</h2>
          <h4>{beneficioPrincipal.descripcion}</h4>
          <p className="mt-1">
            <b>Benefix</b> • <b>{beneficios.length} beneficios</b>
          </p>
        </div>
      </div>

      {/* Encabezado */}
      <div className="grid grid-cols-6 mt-10 mb-4 px-4 gap-4 text-[#a7a7a7] text-sm font-semibold">
        <p><b className="mr-4">#</b>Nombre</p>
        <p>Proveedor</p>
        <p>Precio</p>
        <p>Categoría</p>
        <p className="hidden sm:block">Vigencia</p>
        <p className="text-right">Moneda</p>
      </div>
      <hr />

      {beneficios.map((item, index) => (
        <div
          onClick={() => playWithId(item.id)}
          key={item.id}
          className="grid grid-cols-6 gap-4 px-4 py-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer"
        >
          <div className="text-white text-sm md:text-[15px] flex items-center gap-3">
            <b className="text-[#a7a7a7]">{index + 1}</b>
            <img className="w-10 rounded" src={item.imagenUrl} alt={item.titulo} />
            <div className="flex flex-col">
              <span>{item.titulo.slice(0, 20)}</span>
              <span className="text-[#a7a7a7] text-xs">{item.descripcion.slice(0, 20)}</span>
            </div>
          </div>

          <p className="text-sm text-white">{item.proveedor}</p>
          <p className="text-sm text-white">₡{item.precio.toLocaleString()}</p>
          <p className="text-sm">{item.categoria}</p>
          <p className="text-sm hidden sm:block">{item.vigencia}</p>
          <p className="text-sm text-right text-white">{item.moneda}</p>
        </div>
      ))}
    </div>
  );
};

export default DisplayAlbum;

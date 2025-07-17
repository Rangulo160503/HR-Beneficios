import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
      {/* Navegación principal */}
      <div className="bg-[#121212] rounded h-[15%] flex flex-col justify-around shadow p-4">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer hover:text-green-400"
        >
          <img className="w-6 filter invert" src={assets.home_icon} alt="Inicio" />
          <p className="font-bold">Inicio</p>
        </div>

        <div className="flex items-center gap-3 mt-2">
    <img className="w-6 filter invert" src={assets.search_icon} alt="Buscar" />
    <input
      type="text"
      placeholder="Buscar"
      className="bg-transparent placeholder-white text-white font-bold outline-none border-none focus:outline-none focus:ring-0"
      onChange={(e) => console.log("Buscar:", e.target.value)} // reemplazar luego por setBusqueda si se usa contexto
    />
  </div>
      </div>

      {/* Título externo */}
      <div className="px-4">
        <h1 className="my-5 font-bold text-2xl">Tus Catálogos</h1>
              </div>
      <div>

        {/* Fondo ahora coincide con look Spotify */}
        <div className="bg-[#121212] rounded px-4 py-4">
          <button className=" bg-white text-black px-4 py-1 rounded-full font-bold text-sm hover:bg-opacity-90">
            Crear nuevo catálogo
          </button>

          <p className="text-slate-200 text-xs mt-4 leading-5">
            Guardá beneficios que te interesen para revisarlos más tarde.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

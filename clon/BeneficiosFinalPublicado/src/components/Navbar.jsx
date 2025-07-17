import { assets } from "../assets/assets";


const Navbar = () => {
  return (
    <div className="flex flex-col gap-2 mb-4">
      {/* Logo y botón de cuenta */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src={assets.nowdigital_logo} // reemplazable luego por el logo de Benefix
            alt="Nowdigital logo"
            className="w-40 h-40 object-contain"
          />
          <h1 className="text-white font-bold text-xl mb-2">Benefix</h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-white text-black px-4 py-1 rounded-full font-semibold">
            Mi cuenta
          </button>
        </div>
      </div>

      {/* Categorías de beneficios */}
      <div className="flex gap-3 text-white text-sm font-semibold mt-2 mb-6">
        <p className="cursor-pointer px-4 py-1 rounded-full bg-white bg-opacity-5 hover:bg-opacity-15">
          Todos
        </p>
        <p className="cursor-pointer px-4 py-1 rounded-full bg-white bg-opacity-5 hover:bg-opacity-15">
          Educación
        </p>
        <p className="cursor-pointer px-4 py-1 rounded-full bg-white bg-opacity-5 hover:bg-opacity-15">
          Salud y Bienestar
        </p>
      </div>
    </div>
  );
};

export default Navbar;

import { Routes, Route } from "react-router-dom";
import ProveedorLogin from "./proveedor/pages/ProveedorLogin";
import Gate from "./components/Gate";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<ProveedorLogin />} />
      <Route path="/*" element={<Gate />} />
    </Routes>
  );
}

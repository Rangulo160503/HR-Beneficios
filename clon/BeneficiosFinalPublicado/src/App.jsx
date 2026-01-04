import { Route, Routes } from "react-router-dom";
import ClientLogin from "./pages/ClientLogin";
import Gate from "./components/Gate";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<ClientLogin />} />
      <Route path="/*" element={<Gate />} />
    </Routes>
  );
}

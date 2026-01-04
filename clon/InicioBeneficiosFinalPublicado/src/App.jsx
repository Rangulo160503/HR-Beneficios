import { Route, Routes } from "react-router-dom";
import Gate from "./components/Gate";
import LandingLogin from "./pages/LandingLogin";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LandingLogin />} />
      <Route path="/*" element={<Gate />} />
    </Routes>
  );
}

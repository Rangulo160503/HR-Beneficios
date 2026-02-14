// src/App.jsx
import { Navigate, Route, Routes } from "react-router-dom";

import LoginFormScreen from "./pages/LoginFormScreen.jsx";
import Gate from "./components/Gate.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Routes>
        <Route path="/login" element={<LoginFormScreen />} />
        <Route path="/admin/*" element={<Gate />} />
        <Route path="/" element={<Gate />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

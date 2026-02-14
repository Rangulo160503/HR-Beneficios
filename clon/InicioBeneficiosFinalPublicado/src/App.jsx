import { Route, Routes } from "react-router-dom";
import LandingShell from "./components/LandingShell";
import LoginFormScreen from "./pages/LoginFormScreen";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginFormScreen />} />
      <Route path="/*" element={<LandingShell />} />
    </Routes>
  );
}

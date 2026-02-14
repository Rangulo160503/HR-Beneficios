import { Route, Routes } from "react-router-dom";
import LoginFormScreen from "./pages/LoginFormScreen";
import Gate from "./components/Gate";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginFormScreen />} />
      <Route path="/*" element={<Gate />} />
    </Routes>
  );
}

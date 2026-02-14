import { Route, Routes } from "react-router-dom";
import Gate from "./components/Gate";
import LoginFormScreen from "./pages/LoginFormScreen";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginFormScreen />} />
      <Route path="/*" element={<Gate />} />
    </Routes>
  );
}

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
// O ELIMINA ESTA LÍNEA si no lo vas a usar
// import PlayerContextProvider from "./context/PlayerContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Si deseas usar el provider, descomenta: */}
      {/* <PlayerContextProvider> */}
        <App />
      {/* </PlayerContextProvider> */}
    </BrowserRouter>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ConfirmProvider } from "./shared/components/ui/ConfirmGlobal.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode>
    <BrowserRouter>
      <ConfirmProvider>
        <App />
      </ConfirmProvider>
    </BrowserRouter>
  </React.StrictMode>);

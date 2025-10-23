import React from "react";
import ReactDOM from "react-dom/client";        
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { DeviceProvider } from "./state/DeviceContext";
import "./index.css";                      

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DeviceProvider>
        <App />
      </DeviceProvider>
    </BrowserRouter>
  </React.StrictMode>
);
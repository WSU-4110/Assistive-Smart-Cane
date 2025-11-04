import React from "react";
import ReactDOM from "react-dom/client";        
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { DeviceProvider } from "./state/DeviceContext";
import "./index.css";                    
#include "BluetoothManager.h"
#include "MobileAppModule.h"

BluetoothManager btManager;
MobileAppModule appModule;

void setup() {
  Serial.begin(115200);
  btManager.begin();
  btManager.attach(&appModule);
}

void loop() {
  if (btManager.isConnected()) {
    btManager.sendData("Obstacle detected at 1.2m");
    delay(2000);
  }
}  

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DeviceProvider>
        <App />
      </DeviceProvider>
    </BrowserRouter>
  </React.StrictMode>
);
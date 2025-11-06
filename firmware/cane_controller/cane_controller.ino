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

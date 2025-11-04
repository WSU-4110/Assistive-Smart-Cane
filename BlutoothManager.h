// BluetoothManager.h
#ifndef BLUETOOTH_MANAGER_H
#define BLUETOOTH_MANAGER_H

#include <Arduino.h>
#include "Subject.h"
#include "BluetoothSerial.h"

class BluetoothManager : public Subject {
private:
    BluetoothSerial SerialBT;
public:
    void begin() {
        SerialBT.begin("SmartCane");
        Serial.println("Bluetooth Server started. Waiting for connection...");
    }

    void sendData(String message) {
        if (SerialBT.hasClient()) {
            SerialBT.println(message);
            notify(message);  // Notify all observers that new data was sent
        }
    }

    bool isConnected() {
        return SerialBT.hasClient();
    }
};

#endif

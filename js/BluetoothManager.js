const Subject = require("./Subject");

class BluetoothManager extends Subject {
  constructor(bluetoothSerial, serialLogger) {
    super();
    this.bluetoothSerial = bluetoothSerial;   // fake object we pass in tests
    this.serialLogger = serialLogger;         // fake logger we pass in tests
  }

  begin() {
    this.bluetoothSerial.begin("SmartCane");
    this.serialLogger.log("Bluetooth Server started. Waiting for connection...");
  }

  sendData(message) {
    if (this.bluetoothSerial.hasClient()) {
      this.bluetoothSerial.println(message);
      this.notify(message);
    }
  }

  isConnected() {
    return this.bluetoothSerial.hasClient();
  }
}

module.exports = BluetoothManager;

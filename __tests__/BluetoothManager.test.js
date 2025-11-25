const BluetoothManager = require("../js/BluetoothManager");

class FakeBluetoothSerial {
  constructor() {
    this.connected = false;
    this.messages = [];
    this.begins = [];
  }

  begin(name) {
    this.begins.push(name);
  }

  hasClient() {
    return this.connected;
  }

  println(msg) {
    this.messages.push(msg);
  }
}

class FakeSerialLogger {
  constructor() {
    this.logs = [];
  }

  log(msg) {
    this.logs.push(msg);
  }
}

class FakeObserver {
  constructor() {
    this.received = [];
  }

  update(message) {
    this.received.push(message);
  }
}

test("begin initializes Bluetooth and logs message", () => {
  const fakeBT = new FakeBluetoothSerial();
  const fakeLogger = new FakeSerialLogger();
  const manager = new BluetoothManager(fakeBT, fakeLogger);

  manager.begin();

  expect(fakeBT.begins).toEqual(["SmartCane"]);
  expect(fakeLogger.logs).toContain(
    "Bluetooth Server started. Waiting for connection..."
  );
});

test("isConnected returns true when Bluetooth has a client", () => {
  const fakeBT = new FakeBluetoothSerial();
  fakeBT.connected = true;
  const fakeLogger = new FakeSerialLogger();
  const manager = new BluetoothManager(fakeBT, fakeLogger);

  expect(manager.isConnected()).toBe(true);
});

test("isConnected returns false when Bluetooth has no client", () => {
  const fakeBT = new FakeBluetoothSerial();
  fakeBT.connected = false;
  const fakeLogger = new FakeSerialLogger();
  const manager = new BluetoothManager(fakeBT, fakeLogger);

  expect(manager.isConnected()).toBe(false);
});

test("sendData sends data and notifies observers when connected", () => {
  const fakeBT = new FakeBluetoothSerial();
  fakeBT.connected = true;
  const fakeLogger = new FakeSerialLogger();
  const manager = new BluetoothManager(fakeBT, fakeLogger);

  const obs = new FakeObserver();
  manager.attach(obs);

  manager.sendData("test123");

  // Bluetooth got the message
  expect(fakeBT.messages).toEqual(["test123"]);
  // Observer got notified
  expect(obs.received).toEqual(["test123"]);
});

test("sendData does nothing when not connected", () => {
  const fakeBT = new FakeBluetoothSerial();
  fakeBT.connected = false;
  const fakeLogger = new FakeSerialLogger();
  const manager = new BluetoothManager(fakeBT, fakeLogger);

  const obs = new FakeObserver();
  manager.attach(obs);

  manager.sendData("test123");

  // Nothing sent
  expect(fakeBT.messages).toEqual([]);
  // Observer not notified
  expect(obs.received).toEqual([]);
});

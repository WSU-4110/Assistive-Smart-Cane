#include <SoftwareSerial.h>

const int TRIG_PIN  = 9;
const int ECHO_PIN  = 4;

const int BLUE_LED   = 13;
const int YELLOW_LED = 12;
const int RED_LED    = 11;

const int MOTOR1_PIN = 5;
const int MOTOR2_PIN = A5;

const int BUZZER_PIN = 3;

const int BT_RX_ARDUINO = 2;
const int BT_TX_ARDUINO = 8;
SoftwareSerial BT(BT_RX_ARDUINO, BT_TX_ARDUINO);

const int BUZZER_THRESHOLD    = 40;
const int VIBRATION_THRESHOLD = 100;

class SmartCaneController;

//state design pattern 
class ZoneState {
public:
  virtual void handleDistance(int dist, SmartCaneController &cane) = 0;
  virtual const char *name() const = 0;
  virtual ~ZoneState() {}
};

class SmartCaneController {
public:
  SmartCaneController()
      : filteredDist(999),
        firstSample(true),
        safeState(*this),
        warningState(*this),
        dangerState(*this),
        currentState(&safeState),
        candidateState(&safeState),
        stableCount(0) {}

  void begin() {
    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);

    pinMode(BLUE_LED, OUTPUT);
    pinMode(YELLOW_LED, OUTPUT);
    pinMode(RED_LED, OUTPUT);

    pinMode(MOTOR1_PIN, OUTPUT);
    pinMode(MOTOR2_PIN, OUTPUT);

    pinMode(BUZZER_PIN, OUTPUT);

    digitalWrite(BLUE_LED, HIGH);
    digitalWrite(YELLOW_LED, LOW);
    digitalWrite(RED_LED, LOW);
    digitalWrite(MOTOR1_PIN, LOW);
    digitalWrite(MOTOR2_PIN, LOW);
    noTone(BUZZER_PIN);

    Serial.begin(9600);
    BT.begin(9600);
  }
void update() {
    int raw = readUltrasonic(TRIG_PIN, ECHO_PIN);

    if (firstSample) {
      filteredDist = raw;
      firstSample = false;
    } else {
      filteredDist = (filteredDist * 7 + raw * 3) / 10;
    }

    int dist = filteredDist;

    currentState->handleDistance(dist, *this);

    sendStatus(dist);
  }

  void requestState(ZoneState *desired) {
    if (desired != currentState) {
      if (candidateState != desired) {
        candidateState = desired;
        stableCount = 1;
      } else {
        stableCount++;
        if (stableCount >= REQUIRED_STABLE) {
          currentState = candidateState;
          stableCount = 0;
          Serial.print("Zone changed to: ");
          Serial.println(currentState->name());
        }
      }
    } else {
      candidateState = currentState;
      stableCount = 0;
    }
  }

  void setOutputs(uint8_t blue,
                  uint8_t yellow,
                  uint8_t red,
                  uint8_t motor1,
                  uint8_t motor2,
                  bool buzzerOn) {
    digitalWrite(BLUE_LED,   blue   ? HIGH : LOW);
    digitalWrite(YELLOW_LED, yellow ? HIGH : LOW);
    digitalWrite(RED_LED,    red    ? HIGH : LOW);

    digitalWrite(MOTOR1_PIN, motor1 ? HIGH : LOW);
    digitalWrite(MOTOR2_PIN, motor2 ? HIGH : LOW);

    if (buzzerOn) {
      tone(BUZZER_PIN, 1000);
    } else {
      noTone(BUZZER_PIN);
    }
  }

  ZoneState &getSafeState()    { return safeState; }
  ZoneState &getWarningState() { return warningState; }
  ZoneState &getDangerState()  { return dangerState; }

  const char *currentZoneName() const {
    return currentState->name();
  }

private:

  int  filteredDist;
  bool firstSample;

  class SafeZoneState;
  class WarningZoneState;
  class DangerZoneState;

  SafeZoneState    safeState;
  WarningZoneState warningState;
  DangerZoneState  dangerState;

  ZoneState *currentState;
  ZoneState *candidateState;

  uint8_t stableCount;
  static const uint8_t REQUIRED_STABLE = 3;

  long readUltrasonic(int trigPin, int echoPin) {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    long duration = pulseIn(echoPin, HIGH, 30000UL);
    if (duration == 0) return 999;

    long distance = duration * 0.034 / 2;
    if (distance <= 0 || distance > 400) return 999;
    return distance;
  }

  void sendStatus(int dist) {
    const char *zoneStr = currentZoneName();

    Serial.print("Distance: ");
    Serial.print(dist);
    Serial.print(" cm  Zone: ");
    Serial.println(zoneStr);

    BT.print("DIST,");
    BT.println(dist);
    BT.print("ZONE,");
    BT.println(zoneStr);
  }

  class SafeZoneState : public ZoneState {
  public:
    SafeZoneState(SmartCaneController &c) {}

    void handleDistance(int dist, SmartCaneController &cane) override {
      //Safe zone
      cane.setOutputs(1, 0, 0, 0, 0, false);

      if (dist <= VIBRATION_THRESHOLD - 5) {
        cane.requestState(&cane.getWarningState());
      } else {
        cane.requestState(&cane.getSafeState());
      }
    }

    const char *name() const override { return "SAFE"; }
  };

  class WarningZoneState : public ZoneState {
  public:
    WarningZoneState(SmartCaneController &c) {}

    void handleDistance(int dist, SmartCaneController &cane) override {
      //Warning zone
      cane.setOutputs(1, 1, 0, 1, 1, false);

      if (dist <= BUZZER_THRESHOLD) {
        cane.requestState(&cane.getDangerState());
      } else if (dist > VIBRATION_THRESHOLD + 5) {
        cane.requestState(&cane.getSafeState());
      } else {
        cane.requestState(&cane.getWarningState());
      }
    }

    const char *name() const override { return "WARNING"; }
  };

  class DangerZoneState : public ZoneState {
  public:
    DangerZoneState(SmartCaneController &c) {}

    void handleDistance(int dist, SmartCaneController &cane) override {
      //danger zone
      cane.setOutputs(1, 1, 1, 1, 1, true);

      if (dist > BUZZER_THRESHOLD + 5) {
        cane.requestState(&cane.getWarningState());
      } else {
        cane.requestState(&cane.getDangerState());
      }
    }

    const char *name() const override { return "DANGER"; }
  };
};

SmartCaneController cane;

void setup() {
  cane.begin();
}

void loop() {
  cane.update();
  delay(100);
}
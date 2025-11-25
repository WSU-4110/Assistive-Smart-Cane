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

enum Zone { Z_SAFE, Z_WARNING, Z_DANGER };

int filteredDist = 999;
bool firstSample = true;
Zone currentZone = Z_SAFE;
Zone candidateZone = Z_SAFE;
uint8_t stableCount = 0;
const uint8_t REQUIRED_STABLE = 3;

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

const char* zoneToString(Zone z) {
  if (z == Z_SAFE) return "SAFE";
  if (z == Z_WARNING) return "WARNING";
  return "DANGER";
}

void applyOutputs(Zone z) {
  digitalWrite(BLUE_LED, HIGH);

  if (z == Z_SAFE) {
    digitalWrite(YELLOW_LED, LOW);
    digitalWrite(RED_LED, LOW);
    digitalWrite(MOTOR1_PIN, LOW);
    digitalWrite(MOTOR2_PIN, LOW);
    noTone(BUZZER_PIN);
  } else if (z == Z_WARNING) {
    digitalWrite(YELLOW_LED, HIGH);
    digitalWrite(RED_LED, LOW);
    digitalWrite(MOTOR1_PIN, HIGH);
    digitalWrite(MOTOR2_PIN, HIGH);
    noTone(BUZZER_PIN);
  } else {
    digitalWrite(YELLOW_LED, HIGH);
    digitalWrite(RED_LED, HIGH);
    digitalWrite(MOTOR1_PIN, HIGH);
    digitalWrite(MOTOR2_PIN, HIGH);
    tone(BUZZER_PIN, 1000);
  }
}

void setup() {
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

void loop() {
  int raw = readUltrasonic(TRIG_PIN, ECHO_PIN);

  if (firstSample) {
    filteredDist = raw;
    firstSample = false;
  } else {
    filteredDist = (filteredDist * 7 + raw * 3) / 10;
  }

  int dist = filteredDist;

  if (currentZone == Z_SAFE) {
    if (dist <= VIBRATION_THRESHOLD - 5) {
      candidateZone = Z_WARNING;
    } else {
      candidateZone = Z_SAFE;
    }
  } else if (currentZone == Z_WARNING) {
    if (dist <= BUZZER_THRESHOLD) {
      candidateZone = Z_DANGER;
    } else if (dist > VIBRATION_THRESHOLD + 5) {
      candidateZone = Z_SAFE;
    } else {
      candidateZone = Z_WARNING;
    }
  } else {
    if (dist > BUZZER_THRESHOLD + 5) {
      candidateZone = Z_WARNING;
    } else {
      candidateZone = Z_DANGER;
    }
  }

  if (candidateZone != currentZone) {
    stableCount++;
    if (stableCount >= REQUIRED_STABLE) {
      currentZone = candidateZone;
      stableCount = 0;
      Serial.println(zoneToString(currentZone));
    }
  } else {
    stableCount = 0;
  }

  applyOutputs(currentZone);

  const char* zoneStr = zoneToString(currentZone);

  Serial.print("Distance: ");
  Serial.print(dist);
  Serial.print(" cm  Zone: ");
  Serial.println(zoneStr);

  BT.print("DIST,");
  BT.println(dist);
  BT.print("ZONE,");
  BT.println(zoneStr);

  delay(100);
}

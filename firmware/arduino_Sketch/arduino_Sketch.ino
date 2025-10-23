// Pins
const int trigPin = 9;
const int echoPin = 11;

const int vibrationPin = 3;   // NPN transistor base
const int buzzerPin = 4;      // Passive buzzer

const int redLED = 5;
const int yellowLED = 6;
const int blueLED = 7;

// Distance thresholds in cm
const int buzzerThreshold = 40;
const int vibrationThreshold = 100;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(vibrationPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  pinMode(redLED, OUTPUT);
  pinMode(yellowLED, OUTPUT);
  pinMode(blueLED, OUTPUT);

  digitalWrite(blueLED, HIGH); // Always ON
  digitalWrite(vibrationPin, LOW);
  noTone(buzzerPin);

  Serial.begin(9600);
}

void loop() {
  // Measure distance
  long duration;
  int distance;

  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.034 / 2;

  // Reset everything
  digitalWrite(redLED, LOW);
  digitalWrite(yellowLED, LOW);
  digitalWrite(vibrationPin, LOW);
  noTone(buzzerPin);

  Serial.print("Distance: ");
  Serial.println(distance);

  // Safe Zone: > 100 cm
  if (distance > 100) {
    digitalWrite(blueLED, HIGH);

  // Warning Zone: 41–100 cm
  } else if (distance > buzzerThreshold && distance <= vibrationThreshold) {
    digitalWrite(vibrationPin, HIGH);
    digitalWrite(yellowLED, HIGH);
    digitalWrite(blueLED, HIGH);

  // Danger Zone: 0–40 cm
  } else if (distance > 0 && distance <= buzzerThreshold) {
    digitalWrite(vibrationPin, HIGH);
    tone(buzzerPin, 1000);  // Passive buzzer tone
    digitalWrite(redLED, HIGH);
    digitalWrite(yellowLED, HIGH);
    digitalWrite(blueLED, HIGH);
  }

  delay(100);
}

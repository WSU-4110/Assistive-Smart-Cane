#define TFT_BL 21  // Backlight pin for CYD
void setup() {
  pinMode(TFT_BL, OUTPUT);
  digitalWrite(TFT_BL, HIGH);  // Turn backlight ON
}
void loop() {}
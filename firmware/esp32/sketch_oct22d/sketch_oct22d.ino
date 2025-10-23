#include <TFT_eSPI.h> // Display library
#include <SPI.h>

TFT_eSPI tft = TFT_eSPI(); // Create display object

void setup() {
tft.init(); // Initialize display
tft.setRotation(1); // Landscape orientation
tft.fillScreen(TFT_BLACK);
tft.setTextColor(TFT_YELLOW, TFT_BLACK);
tft.setTextSize(2);
tft.println("Hello Smart Cane!");
}

void loop() {
// nothing here yet
}
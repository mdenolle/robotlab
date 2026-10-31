// RobotLab Desk Buddy — Arduino Uno / compatible 5 V board.
// D5 -> 220 ohm resistor -> left LED anode; LED cathode -> GND.
// D6 -> 220 ohm resistor -> right LED anode; LED cathode -> GND.
// D2 -> normally-open button -> GND (uses internal pull-up).
// D9 -> passive piezo +; piezo - -> GND. USB power only.
const byte LEFT_EYE = 5, RIGHT_EYE = 6, BUTTON = 2, PIEZO = 9;
const unsigned long BLINK_INTERVAL = 3000;
unsigned long lastBlink = 0, changedAt = 0;
bool lastReading = HIGH, stableButton = HIGH;
void eyes(bool on) {
  digitalWrite(LEFT_EYE, on ? HIGH : LOW);
  digitalWrite(RIGHT_EYE, on ? HIGH : LOW);
}
void hello() {
  const int notes[] = {523, 659, 784};
  for (byte i = 0; i < 3; i++) {
    eyes(true); tone(PIEZO, notes[i], 100); delay(120);
    eyes(false); delay(50);
  }
  noTone(PIEZO); eyes(true);
  lastBlink = millis();
}
void setup() {
  pinMode(LEFT_EYE, OUTPUT); pinMode(RIGHT_EYE, OUTPUT);
  pinMode(PIEZO, OUTPUT); pinMode(BUTTON, INPUT_PULLUP);
  eyes(true);
}
void loop() {
  const unsigned long now = millis();
  const bool reading = digitalRead(BUTTON);
  if (reading != lastReading) changedAt = now;
  if (now - changedAt > 30 && reading != stableButton) {
    stableButton = reading;
    if (stableButton == LOW) hello();
  }
  lastReading = reading;
  if (millis() - lastBlink >= BLINK_INTERVAL) {
    eyes(false); delay(120); eyes(true); lastBlink = millis();
  }
}

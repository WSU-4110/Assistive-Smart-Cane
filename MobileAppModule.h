// MobileAppModule.h
#ifndef MOBILE_APP_MODULE_H
#define MOBILE_APP_MODULE_H

#include <Arduino.h>
#include "Observer.h"

class MobileAppModule : public Observer {
public:
    void update(String message) override {
        Serial.println("Mobile App Module received: " + message);
        // Here you could trigger UI update, sound, or LED feedback
    }
};

#endif

// Observer.h
#ifndef OBSERVER_H
#define OBSERVER_H

#include <Arduino.h>

class Observer {
public:
    virtual void update(String message) = 0;  // this gets called when data changes
};

#endif

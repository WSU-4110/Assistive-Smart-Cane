// Subject.h
#ifndef SUBJECT_H
#define SUBJECT_H

#include <vector>
#include "Observer.h"

class Subject {
private:
    std::vector<Observer*> observers;
public:
    void attach(Observer* obs) { observers.push_back(obs); }

    void notify(String message) {
        for (auto o : observers) {
            o->update(message);
        }
    }
};

#endif

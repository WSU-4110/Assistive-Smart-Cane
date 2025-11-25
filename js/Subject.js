class Subject {
    constructor() {
      this.observers = [];
    }
  
    attach(obs) {
      this.observers.push(obs);
    }
  
    notify(message) {
      this.observers.forEach((o) => {
        o.update(message);
      });
    }
  }
  
  module.exports = Subject;
  
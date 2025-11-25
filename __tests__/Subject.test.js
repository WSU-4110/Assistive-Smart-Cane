const Subject = require("../js/Subject");

class FakeObserver {
  constructor() {
    this.received = [];
  }

  update(message) {
    this.received.push(message);
  }
}

test("attach stores observer and notify calls update for one observer", () => {
  const subject = new Subject();
  const obs = new FakeObserver();

  subject.attach(obs);
  subject.notify("hello");

  expect(obs.received).toEqual(["hello"]);
});

test("notify calls update on all attached observers", () => {
  const subject = new Subject();
  const obs1 = new FakeObserver();
  const obs2 = new FakeObserver();

  subject.attach(obs1);
  subject.attach(obs2);

  subject.notify("ALERT");

  expect(obs1.received).toEqual(["ALERT"]);
  expect(obs2.received).toEqual(["ALERT"]);
});

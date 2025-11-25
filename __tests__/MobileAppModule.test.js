const MobileAppModule = require("../js/MobileAppModule");

test("update logs the received message with prefix", () => {
  const spy = jest.spyOn(console, "log").mockImplementation(() => {});

  const module = new MobileAppModule();
  module.update("hello");

  expect(spy).toHaveBeenCalledWith("Mobile App Module received: hello");

  spy.mockRestore();
});

// app/components/__tests__/CaneDetectionCard.test.tsx

import {
  getZoneColor,
  getNextIndex,
  addHistoryEntry,
} from "../utils/CaneDetectionCard.helpers";

describe("CaneDetectionCard logic helpers", () => {
  const colors = {
    successGreen: "#00FF00",
    primaryPurple: "#800080",
    dangerRed: "#FF0000",
  };

  test("getZoneColor returns SAFE color (case-insensitive)", () => {
    expect(getZoneColor("SAFE", colors)).toBe(colors.successGreen);
    expect(getZoneColor("safe", colors)).toBe(colors.successGreen);
  });

  test("getZoneColor returns WARNING color (case-insensitive)", () => {
    expect(getZoneColor("WARNING", colors)).toBe(colors.primaryPurple);
    expect(getZoneColor("warning", colors)).toBe(colors.primaryPurple);
  });

  test("getZoneColor falls back to DANGER color for other zones", () => {
    expect(getZoneColor("DANGER", colors)).toBe(colors.dangerRed);
    expect(getZoneColor("unknown", colors)).toBe(colors.dangerRed);
  });

  test("getNextIndex wraps around using modulo", () => {
    expect(getNextIndex(0, 5)).toBe(1);
    expect(getNextIndex(4, 5)).toBe(0); // wrap
  });

  test("addHistoryEntry adds new entry to the front", () => {
    const history = [{ distance: 10 }, { distance: 20 }];
    const updated = addHistoryEntry(history, { distance: 99 });

    expect(updated[0].distance).toBe(99);
    expect(updated[1].distance).toBe(10);
    expect(updated[2].distance).toBe(20);
  });

  test("addHistoryEntry never keeps more than 25 entries", () => {
    const many = Array.from({ length: 25 }, (_, i) => ({ distance: i }));
    const updated = addHistoryEntry(many, { distance: 999 });

    expect(updated.length).toBe(25);
    expect(updated[0].distance).toBe(999);
  });
});

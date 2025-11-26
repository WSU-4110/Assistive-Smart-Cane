//app/components/utils/CaneDetectionCard.helpers.ts

export type Zone = "SAFE" | "WARNING" | "DANGER" | string;

export const getZoneColor = (zone: Zone, colors: any) => {
  const z = zone.toUpperCase();
  if (z === "SAFE") return colors.successGreen;
  if (z === "WARNING") return colors.primaryPurple;
  return colors.dangerRed;
};

export const getNextIndex = (current: number, length: number) => {
  if (length <= 0) return 0;
  return (current + 1) % length;
};

export const addHistoryEntry = <T,>(history: T[], entry: T) => {
  return [entry, ...history].slice(0, 25);
};

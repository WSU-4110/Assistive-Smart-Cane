const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "..", "SerialMonitor_DemoData.txt");
const outputPath = path.join(__dirname, "..", "app", "data", "demoCaneData.json");

const raw = fs.readFileSync(inputPath, "utf8");
const lines = raw.split(/\r?\n/);

const data = [];

for (const line of lines) {
  const match = line.match(/Distance:\s*(\d+)\s*cm\s*Zone:\s*(SAFE|WARNING|DANGER)/i);
  if (match) {
    data.push({
      distance: Number(match[1]),
      zone: match[2].toUpperCase(),
    });
  }
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf8");

console.log(`Wrote ${data.length} samples to ${outputPath}`);

import express from "express";
import cors from "cors";
import { SerialPort, ReadlineParser } from "serialport";

const PORT_NAME = "COM6"; // update with your HC-05 COM port

const port = new SerialPort({
  path: PORT_NAME,
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

let lastDistance: string | null = null;
let lastZone: string | null = null;

parser.on("data", (line: string) => {
  line = line.trim();
  if (line.startsWith("DIST")) lastDistance = line.split(",")[1];
  if (line.startsWith("ZONE")) lastZone = line.split(",")[1];
  console.log({ lastDistance, lastZone });
});

const app = express();
app.use(cors());

app.get("/cane-data", (req, res) => {
  res.json({
    distance: lastDistance,
    zone: lastZone,
  });
});

app.listen(5000, () => {
  console.log("Server running at http://0.0.0.0:5000");
});

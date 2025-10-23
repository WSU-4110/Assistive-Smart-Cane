import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useDevice } from "../state/DeviceContext";

type Device = { id: string; name: string };

export default function Scan() {
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { connect } = useDevice();

  async function handleScan() {
    setScanning(true);
    setSelectedId(null);
    setDevices([]);
    await new Promise((r) => setTimeout(r, 800)); 
    setDevices([
      { id: "AA:BB:CC:11:22:33", name: "Assistive_Cane" },
      { id: "DD:EE:FF:44:55:66", name: "Cane Backup" },
    ]);
    setScanning(false);
  }

  function handleConnect() {
    if (!selectedId) return;
    const dev = devices.find((d) => d.id === selectedId)!;
    connect({ name: dev.name, id: dev.id });
    alert(`Connected to ${dev.name}`);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b-4 border-muted">
        <div className="max-w-md mx-auto px-4 py-5">
          <h1 className="text-2xl font-bold">Scan &amp; Connect</h1>
          <p className="text-muted-foreground">Find your cane and connect securely.</p>
        </div>
      </header>

      <main className="max-w-md mx-auto p-5">
        {/* Bluetooth control */}
        <Card className="p-6 md:p-8 mb-10">
          <div className="flex items-center justify-between gap-6">
            <div className="min-w-0">
              <div className="text-lg font-semibold">Bluetooth</div>
              <div className="text-sm text-muted-foreground">
                Make sure Bluetooth is ON on your phone.
              </div>
            </div>
            <Button
              size="lg"
              onClick={handleScan}
              disabled={scanning}
              className="rounded-full"
            >
              {scanning ? "Scanning…" : "Scan"}
            </Button>
          </div>
        </Card>

        {/* Device list*/}
        <section aria-live="polite" aria-label="Available devices" className="mt-12">
          <div className="border-2 border-black rounded-2xl overflow-hidden bg-card text-card-foreground">
            {devices.length === 0 && !scanning ? (
              <div className="px-5 py-8 text-muted-foreground">
                No devices yet. Tap <strong>Scan</strong> to search.
              </div>
            ) : (
              devices.map((d, i) => {
                const selected = selectedId === d.id;
                const isLast = i === devices.length - 1;
                return (
                  <button
                    key={d.id}
                    type="button"
                    className={[
                      "w-full text-left px-5 py-5 flex items-center justify-between gap-6",
                      !isLast ? "border-b-2 border-border" : "",
                      selected ? "bg-muted" : "hover:bg-muted",
                      "focus:outline-none focus:ring-4 focus:ring-blue-300",
                    ].join(" ")}
                    onClick={() => setSelectedId(d.id)}
                    aria-pressed={selected}
                    aria-label={`Device ${d.name || "Unknown device"}${selected ? " selected" : ""}`}
                  >
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{d.name || "Unknown device"}</div>
                      <div className="text-xs text-muted-foreground truncate">{d.id}</div>
                    </div>
                    <span className="text-sm">
                      {selected ? "Selected" : "Tap to select"}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* Spacer */}
        <div className="h-6" />

        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-full py-4 mt-8"
          onClick={handleConnect}
          disabled={!selectedId}
          aria-label="Connect to selected device"
        >
          {selectedId ? "Connect" : "Select a device to connect"}
        </Button>

        <p className="mt-3 text-xs text-muted-foreground text-center pb-6">
          Tip: Stay within a few feet of the cane while connecting.
        </p>
      </main>
    </div>
  );
}

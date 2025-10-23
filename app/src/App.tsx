import { NavLink, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import Controls from "./pages/Controls";
import Status from "./pages/Status";

const tab =
  "px-4 py-2 mx-1 rounded-full text-base font-semibold border-2";
const active = "bg-primary text-primary-foreground border-primary";
const inactive = "bg-card text-card-foreground border-border hover:bg-muted";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation */}
      <nav className="sticky top-0 z-10 bg-background border-b-4 border-muted">
        <div className="max-w-md mx-auto px-3 py-3 flex flex-wrap justify-center gap-3">
          <NavLink to="/" end className={({ isActive }) => `${tab} ${isActive ? active : inactive}`}>
            Home
          </NavLink>
          <NavLink to="/scan" className={({ isActive }) => `${tab} ${isActive ? active : inactive}`}>
            Scan
          </NavLink>
          <NavLink to="/controls" className={({ isActive }) => `${tab} ${isActive ? active : inactive}`}>
            Controls
          </NavLink>
          <NavLink to="/status" className={({ isActive }) => `${tab} ${isActive ? active : inactive}`}>
            Status
          </NavLink>
        </div>
      </nav>

      {/* Routed pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/controls" element={<Controls />} />
        <Route path="/status" element={<Status />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}

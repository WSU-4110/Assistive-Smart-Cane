import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import Controls from "./pages/Controls";
import Status from "./pages/Status";
import Help from "./pages/Help";

const tab = "px-3 py-2 rounded-lg text-lg font-semibold border-2";
const active = "bg-blue-100 text-blue-800 border-blue-800";
const idle = "bg-card text-card-foreground border-border hover:bg-muted";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-10 bg-background border-b-4 border-muted">
        <div className="max-w-md mx-auto p-3 flex gap-2 justify-between">
          <NavLink to="/" end className={({isActive}) => `${tab} ${isActive ? active : idle}`}>Home</NavLink>
          <NavLink to="/scan" className={({isActive}) => `${tab} ${isActive ? active : idle}`}>Scan</NavLink>
          <NavLink to="/controls" className={({isActive}) => `${tab} ${isActive ? active : idle}`}>Controls</NavLink>
          <NavLink to="/status" className={({isActive}) => `${tab} ${isActive ? active : idle}`}>Status</NavLink>
          <NavLink to="/help" className={({isActive}) => `${tab} ${isActive ? active : idle}`}>Help</NavLink>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/controls" element={<Controls />} />
        <Route path="/status" element={<Status />} />
        <Route path="/help" element={<Help />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}

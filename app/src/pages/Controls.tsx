import { Link } from "react-router-dom";

export default function Controls() {
  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold">Controls</h1>
      <p className="mt-2 text-muted-foreground">
        Controls page in progress.
      </p>

      <div className="mt-6 flex gap-3">
        <Link
          to="/"
          className="px-4 py-2 rounded-full border-2 border-border bg-card text-card-foreground hover:bg-muted"
        >
          Go Home
        </Link>
        <Link
          to="/scan"
          className="px-4 py-2 rounded-full border-2 border-border bg-card text-card-foreground hover:bg-muted"
        >
          Go to Scan
        </Link>
      </div>
    </main>
  );
}

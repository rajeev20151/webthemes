import { Suspense } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color5)]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-[var(--color6)]/20 border-t-[var(--color6)] rounded-full animate-spin" />
        <p className="fontStyle9 text-[var(--color4)]">Loading...</p>
      </div>
    </div>
  );
}

export default function MainLayout() {
  return (
    <>
      <Navbar />
      {/* Only the page area suspends — navbar/footer stay mounted, so route
          changes don't flash a full-screen loader and feel instant. */}
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      <Footer />
    </>
  );
}

import { Outlet } from "react-router-dom";
import { useState } from "react";
import "../assets/css/admin.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout min-h-screen xl:flex">
      {/* Backdrop — visible on mobile/tablet when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 xl:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 xl:ml-[290px] transition-all duration-300 ease-in-out">
        <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
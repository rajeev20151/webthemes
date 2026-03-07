import {Outlet} from "react-router-dom"
import "../assets/css/admin.css"
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AdminLayout() {
  return (
    <div className="admin-layout min-h-screen xl:flex">
      <Sidebar />
      <div className="flex-1 transition-all duration-300 ease-in-out xl:ml-[290px]">
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
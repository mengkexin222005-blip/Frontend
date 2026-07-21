import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/sidebar/Sidebar";

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="px-6 py-5 flex-1 min-w-0 flex flex-col overflow-hidden">
        <Navbar />

        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

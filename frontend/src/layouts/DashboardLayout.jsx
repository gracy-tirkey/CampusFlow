import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-light text-text">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-56 bg-dark transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* Main Area */}
      <div className="flex-1 flex flex-col md:ml-0">
        <Navbar showLogo={false} showSidebar={true} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="p-6 overflow-y-auto bg-light">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;

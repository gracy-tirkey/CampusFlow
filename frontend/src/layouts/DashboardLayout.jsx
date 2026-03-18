import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-light text-text">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        <Navbar showLogo={false} showSidebar={true} />

        <div className="p-6 overflow-y-auto bg-light">
          {children}
        </div>

      </div>

    </div>
  );
}

export default DashboardLayout;

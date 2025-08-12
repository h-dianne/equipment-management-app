import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6 flex-grow">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white p-4 text-right">
        &copy; {new Date().getFullYear()} Equipment Management
      </footer>
    </div>
  );
};

export default Layout;

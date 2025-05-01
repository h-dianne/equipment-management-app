import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const currentPage = useLocation();

  const knownRoutes = ["/", "/home", "/register", "/detail", "/edit"];

  const isKnownRoute = knownRoutes.some(
    (route) =>
      currentPage.pathname === route ||
      (route !== "/" && currentPage.pathname.startsWith(route + "/"))
  );

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            備品管理システム
          </Link>
          <div className="space-x-4">
            {isKnownRoute && (
              <Link
                to="/register"
                className="px-4 py-2 text-sm text-gray-900 bg-slate-400
              hover:bg-slate-600 hover:text-white rounded-md transition-colors"
              >
                新規登録
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

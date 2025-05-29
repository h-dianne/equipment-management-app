import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Layout from "./components/common/Layout";
import HomePage from "./pages/Homepage";
import RegisterPage from "./pages/RegisterPage";
import DetailPage from "./pages/DetailPage";
import EditPage from "./pages/EditPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Index route - redirects to home */}
          <Route index element={<Navigate to="/home" replace />} />

          {/* Main routes */}
          <Route path="home" element={<HomePage />} />
          <Route path="register" element={<RegisterPage />} />

          {/* Dynamic routes*/}
          <Route path="detail/:id" element={<DetailPage />} />
          <Route path="edit/:id" element={<EditPage />} />

          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;

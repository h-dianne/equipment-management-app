import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/common/Layout";
import HomePage from "./pages/Homepage";
import RegisterPage from "./pages/RegisterPage";
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

          {/* Example of dynamic route - would be implemented later */}
          <Route
            path="detail/:id"
            element={<div>備品詳細ページ (実装予定)</div>}
          />
          <Route
            path="edit/:id"
            element={<div>備品編集ページ (実装予定)</div>}
          />

          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

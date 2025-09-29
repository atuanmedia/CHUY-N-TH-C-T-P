import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginAdmin from "./pages/admin/LoginAdmin";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import AdminLayout from "./components/admin/AdminLayout";
import Residents from "./pages/admin/Residents";
import Apartment from "./pages/admin/Apartments";
import Invoices from "./pages/admin/Invoices";
import Tickets from "./pages/admin/Tickets";
import Notices from "./pages/admin/Notices";
import Reports from "./pages/admin/Reports";
function App() {
  return (
    <Router>
      <Routes>
        {/* Admin layout: đặt tất cả route /admin bên trong để dùng cùng sidebar/header */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* /admin => trang đăng nhập (index route) */}
          <Route index element={<LoginAdmin />} />
          <Route path="dashboard" element={<DashboardAdmin />} />
          {/* sau này thêm residents, apartments… ở đây */}
          <Route path="residents" element={<Residents />} />
          <Route path="apartments" element={<Apartment />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="notices" element={<Notices />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

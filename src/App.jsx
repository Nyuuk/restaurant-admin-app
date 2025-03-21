import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';

// Layouts
import DashboardLayout from './components/layouts/DashboardLayout';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';

// Place holder components - will be implemented later
const MenuPage = () => <div>Halaman Manajemen Menu</div>;
const CategoryPage = () => <div>Halaman Manajemen Kategori</div>;
const TablePage = () => <div>Halaman Manajemen Meja</div>;
const OrderPage = () => <div>Halaman Manajemen Pesanan</div>;
const ReservationPage = () => <div>Halaman Manajemen Reservasi</div>;
const PaymentPage = () => <div>Halaman Manajemen Pembayaran</div>;
const ReportsPage = () => <div>Halaman Laporan (hanya untuk Owner)</div>;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Dashboard routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="category" element={<CategoryPage />} />
            <Route path="table" element={<TablePage />} />
            <Route path="order" element={<OrderPage />} />
            <Route path="reservation" element={<ReservationPage />} />
            <Route path="payment" element={<PaymentPage />} />

            {/* Owner-only route */}
            <Route
              path="reports"
              element={
                <ProtectedRoute requiredRole="owner">
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
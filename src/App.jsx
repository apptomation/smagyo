import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { TenantProvider } from "./context/TenantContext";
import { AdminAuthProvider } from "./admin/context/AdminAuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AdminLayout from "./admin/components/AdminLayout";
import AdminLoginPage from "./admin/pages/AdminLoginPage";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminTenants from "./admin/pages/AdminTenants";
import AdminSettings from "./admin/pages/AdminSettings";
import TenantLayout from "./tenant/components/TenantLayout";
import TenantDashboard from "./tenant/pages/TenantDashboard";
import TenantProducts from "./tenant/pages/TenantProducts";
import TenantOrders from "./tenant/pages/TenantOrders";
import TenantSettings from "./tenant/pages/TenantSettings";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import {
  RegisterPage,
  LoginPage,
  WishlistPage,
  AboutPage,
  NotFoundPage,
} from "./pages/PlaceholderPages";
import ShopPage from "./pages/ShopPage";

function StorefrontLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

// Wraps all /admin/* and /tenant/* routes in a single shared AdminAuthProvider
function AdminRoot() {
  return (
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── All admin/tenant routes share one AdminAuthProvider via AdminRoot ── */}
        <Route element={<AdminRoot />}>
          {/* Shared login for both roles */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Super admin — AdminLayout redirects TENANT_ADMIN to /tenant */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders"   element={<AdminOrders />} />
            <Route path="tenants"  element={<AdminTenants />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Tenant admin — TenantLayout redirects non-TENANT_ADMIN away */}
          <Route path="/tenant" element={<TenantLayout />}>
            <Route index element={<TenantDashboard />} />
            <Route path="products" element={<TenantProducts />} />
            <Route path="orders"   element={<TenantOrders />} />
            <Route path="settings" element={<TenantSettings />} />
          </Route>
        </Route>

        {/* ── Customer-facing storefront ── */}
        <Route
          path="*"
          element={
            <TenantProvider>
              <CartProvider>
                <StorefrontLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/occasions" element={<ShopPage title="Shop by Occasion" />} />
                  <Route path="/occasions/:slug" element={<ShopPage title="Shop by Occasion" />} />
                  <Route path="/bouquets" element={<ShopPage defaultCategory="Bouquets" />} />
                  <Route path="/bouquets/:slug" element={<ShopPage defaultCategory="Bouquets" />} />
                  <Route path="/plants" element={<ShopPage defaultCategory="Plants" />} />
                  <Route path="/plants/:slug" element={<ShopPage defaultCategory="Plants" />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </StorefrontLayout>
            </CartProvider>
            </TenantProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App

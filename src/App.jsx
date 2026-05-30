import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import {
  RegisterPage,
  LoginPage,
  OccasionsPage,
  BouquetsPage,
  PlantsPage,
  WishlistPage,
  AboutPage,
  NotFoundPage,
} from "./pages/PlaceholderPages";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/occasions" element={<OccasionsPage />} />
            <Route path="/occasions/:slug" element={<OccasionsPage />} />
            <Route path="/bouquets" element={<BouquetsPage />} />
            <Route path="/bouquets/:slug" element={<BouquetsPage />} />
            <Route path="/plants" element={<PlantsPage />} />
            <Route path="/plants/:slug" element={<PlantsPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App

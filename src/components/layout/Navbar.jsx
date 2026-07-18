import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Leaf,
  User,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { NAV_LINKS } from "../../data/navigation";

const C = {
  charcoal: "#1C1C1C",
  emerald: "#2D6A4F",
  sage: "#52796F",
  mint: "#84A98C",
  cream: "#FAF7F2",
};

export default function Navbar() {
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, []);

  return (
    <>
      {/* ── Announcement bar ── */}
      <div
        className="hidden md:flex items-center justify-between px-8 py-1.5 text-xs font-medium tracking-wide"
        style={{ background: C.emerald, color: "#fff" }}
      >
        <span>🌿 Sustainably sourced · Same-day delivery available</span>
        <span>Free delivery on orders over $60 · Use code BLOOM10 for 10% off</span>
        <span className="flex items-center gap-3">
          <a href="/admin/login" className="hover:underline">Sign In</a>
          <span>|</span>
          <a href="/admin/login" className="hover:underline">Create Account</a>
        </span>
      </div>

      {/* ── Main header ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/85 backdrop-blur-xl shadow-sm"
            : "bg-white/40 backdrop-blur-md"
        }`}
        style={{ borderBottom: scrolled ? `1px solid rgba(45,106,79,.12)` : "none" }}
      >
        <nav className="flex items-center justify-between px-4 md:px-10 h-16 max-w-screen-2xl mx-auto">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 select-none flex-shrink-0">
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm"
              style={{ background: C.emerald }}
            >
              <Leaf size={17} color="#fff" strokeWidth={2.5} />
            </span>
            <span
              className="font-bold text-xl tracking-tight hidden sm:block"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.charcoal }}
            >
              sma<span style={{ color: C.emerald }}>yo</span>
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <ul className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <li
                key={link.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <NavLink
                  to={link.href}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150"
                  style={({ isActive }) => ({
                    color: isActive || openDropdown === link.label ? C.emerald : C.charcoal,
                    background:
                      openDropdown === link.label ? "rgba(45,106,79,.07)" : "transparent",
                    fontFamily: "'DM Sans', sans-serif",
                  })}
                >
                  {link.label}
                  {link.sub.length > 0 && (
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${
                        openDropdown === link.label ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </NavLink>

                {/* Dropdown */}
                {link.sub.length > 0 && openDropdown === link.label && (
                  <div
                    className="absolute top-full left-0 mt-1 w-52 rounded-2xl overflow-hidden shadow-xl py-1.5"
                    style={{
                      background: "rgba(255,255,255,0.97)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(45,106,79,.12)",
                    }}
                  >
                    {link.sub.map((s) => (
                      <Link
                        key={s.label}
                        to={s.href}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors duration-100 hover:bg-emerald-50"
                        style={{
                          color: C.charcoal,
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                        onClick={() => setOpenDropdown(null)}
                      >
                        <span className="text-base">{s.emoji}</span>
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* ── Action icons ── */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <div className="relative hidden md:flex items-center">
              {searchOpen ? (
                <div
                  className="flex items-center rounded-full px-3 py-1.5 gap-2"
                  style={{
                    border: `1.5px solid ${C.emerald}`,
                    background: "rgba(255,255,255,.9)",
                  }}
                >
                  <Search size={14} style={{ color: C.sage }} />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search flowers, bouquets…"
                    className="outline-none bg-transparent text-sm w-44"
                    style={{ color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}
                    onBlur={() => {
                      if (!searchQuery) setSearchOpen(false);
                    }}
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    aria-label="Close search"
                  >
                    <X size={13} style={{ color: C.sage }} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-emerald-50 transition-colors"
                  style={{ color: C.charcoal }}
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-rose-50 transition-colors"
              style={{ color: C.charcoal }}
              aria-label="Wishlist"
            >
              <Heart size={18} />
            </Link>

            {/* Account */}
            <Link
              to="/login"
              className="w-9 h-9 rounded-full items-center justify-center hover:bg-emerald-50 transition-colors hidden md:flex"
              style={{ color: C.charcoal }}
              aria-label="Account"
            >
              <User size={18} />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-emerald-50 transition-colors"
              style={{ color: C.charcoal }}
              aria-label={`Cart (${totalItems} items)`}
            >
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: C.emerald }}
                >
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-emerald-50 transition-colors"
              style={{ color: C.charcoal }}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile slide-out drawer ── */}
      <div
        className={`fixed inset-0 z-[200] transition-all duration-300 ${
          menuOpen ? "visible" : "invisible pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Drawer panel */}
        <aside
          className={`absolute right-0 top-0 h-full w-[80vw] max-w-xs flex flex-col overflow-y-auto transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ background: "rgba(250,247,242,.98)", backdropFilter: "blur(20px)" }}
        >
          {/* Drawer header */}
          <div
            className="flex items-center justify-between p-5 border-b"
            style={{ borderColor: "rgba(45,106,79,.12)" }}
          >
            <Link
              to="/"
              className="font-bold text-xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.charcoal }}
              onClick={() => setMenuOpen(false)}
            >
              smag<span style={{ color: C.emerald }}>yo</span>
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X size={20} style={{ color: C.charcoal }} />
            </button>
          </div>

          {/* Mobile search */}
          <div className="px-5 py-4">
            <div
              className="flex items-center gap-2 rounded-full px-3.5 py-2.5"
              style={{ border: `1px solid rgba(45,106,79,.25)`, background: "rgba(255,255,255,.8)" }}
            >
              <Search size={14} style={{ color: C.sage }} />
              <input
                type="text"
                placeholder="Search flowers, bouquets…"
                className="outline-none bg-transparent text-sm flex-1"
                style={{ color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>
          </div>

          {/* Mobile nav */}
          <nav className="flex-1 px-3 pb-4">
            {NAV_LINKS.map((link) => (
              <div key={link.label}>
                <button
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium hover:bg-emerald-50 transition-colors"
                  style={{ color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}
                  onClick={() =>
                    setOpenDropdown(openDropdown === link.label ? null : link.label)
                  }
                >
                  {link.label}
                  {link.sub.length > 0 && (
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${
                        openDropdown === link.label ? "rotate-180" : ""
                      }`}
                      style={{ color: C.sage }}
                    />
                  )}
                </button>
                {link.sub.length > 0 && openDropdown === link.label && (
                  <div
                    className="ml-4 pl-3 mb-2 space-y-0.5"
                    style={{ borderLeft: `2px solid rgba(45,106,79,.2)` }}
                  >
                    {link.sub.map((s) => (
                      <Link
                        key={s.label}
                        to={s.href}
                        className="flex items-center gap-2 px-2 py-2 text-sm rounded-lg hover:bg-emerald-50 transition-colors"
                        style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}
                        onClick={() => setMenuOpen(false)}
                      >
                        <span>{s.emoji}</span>
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Drawer CTA buttons */}
          <div className="px-5 pb-8 flex gap-3">
            <Link
              to="/login"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-medium border transition-colors hover:bg-emerald-50"
              style={{
                borderColor: C.emerald,
                color: C.emerald,
                fontFamily: "'DM Sans', sans-serif",
              }}
              onClick={() => setMenuOpen(false)}
            >
              <User size={14} /> Sign In
            </Link>
            <Link
              to="/cart"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-medium text-white transition-colors"
              style={{ background: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
              onClick={() => setMenuOpen(false)}
            >
              <ShoppingCart size={14} /> Cart
              {totalItems > 0 && (
                <span className="bg-white text-emerald-700 text-[10px] font-bold rounded-full px-1.5">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}

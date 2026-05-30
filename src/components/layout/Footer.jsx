import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Leaf,
  ArrowRight,
} from "lucide-react";

const C = {
  charcoal: "#1C1C1C",
  emerald: "#2D6A4F",
  mint: "#84A98C",
};

const FOOTER_COLS = [
  {
    title: "Customer Care",
    links: [
      { label: "Track My Order", href: "/orders" },
      { label: "Delivery Information", href: "/delivery" },
      { label: "Returns & Exchanges", href: "/returns" },
      { label: "FAQs", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Corporate Services",
    links: [
      { label: "Event & Wedding Flowers", href: "/services/weddings" },
      { label: "Corporate Gifting", href: "/services/corporate" },
      { label: "Subscription Boxes", href: "/services/subscriptions" },
      { label: "Bulk Orders", href: "/services/bulk" },
      { label: "Become a Partner", href: "/partners" },
    ],
  },
  {
    title: "Our Company",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Grower Partners", href: "/growers" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
    ],
  },
];

// Inline SVG social icons (lucide-react dropped brand icons in v0.400+)
const SocialIcons = {
  Instagram: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
    </svg>
  ),
  Facebook: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  Twitter: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Youtube: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.97A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
    </svg>
  ),
};

const SOCIAL = [
  { Icon: SocialIcons.Instagram, label: "Instagram", href: "#" },
  { Icon: SocialIcons.Facebook, label: "Facebook", href: "#" },
  { Icon: SocialIcons.Twitter, label: "Twitter / X", href: "#" },
  { Icon: SocialIcons.Youtube, label: "YouTube", href: "#" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <footer style={{ background: C.charcoal, color: "#fff" }}>
      {/* ── Main grid ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

        {/* Brand column */}
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-5">
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: C.emerald }}
            >
              <Leaf size={17} color="#fff" strokeWidth={2.5} />
            </span>
            <span
              className="font-bold text-xl tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              smag<span style={{ color: C.mint }}>yo</span>
            </span>
          </Link>

          <p
            className="text-sm leading-relaxed mb-6 max-w-xs"
            style={{ color: "rgba(255,255,255,.5)", fontFamily: "'DM Sans', sans-serif" }}
          >
            Celebrating life's most beautiful moments with handcrafted floral
            arrangements, delivered fresh from sustainable farms worldwide.
          </p>

          <div className="space-y-2">
            <div
              className="flex items-center gap-2 text-sm"
              style={{ color: "rgba(255,255,255,.5)", fontFamily: "'DM Sans', sans-serif" }}
            >
              <Phone size={13} style={{ color: C.mint }} />
              <span>+1 (800) SMAGYO-1</span>
            </div>
            <div
              className="flex items-center gap-2 text-sm"
              style={{ color: "rgba(255,255,255,.5)", fontFamily: "'DM Sans', sans-serif" }}
            >
              <Mail size={13} style={{ color: C.mint }} />
              <span>hello@smagyo.com</span>
            </div>
            <div
              className="flex items-center gap-2 text-sm"
              style={{ color: "rgba(255,255,255,.5)", fontFamily: "'DM Sans', sans-serif" }}
            >
              <MapPin size={13} style={{ color: C.mint }} />
              <span>21 Bloom Street, New York, NY 10001</span>
            </div>
          </div>
        </div>

        {/* Link columns */}
        {FOOTER_COLS.map((col) => (
          <div key={col.title}>
            <h4
              className="text-xs font-bold uppercase tracking-[0.16em] mb-4"
              style={{ color: C.mint, fontFamily: "'DM Sans', sans-serif" }}
            >
              {col.title}
            </h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm transition-colors duration-150 hover:text-white"
                    style={{ color: "rgba(255,255,255,.45)", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Newsletter + Social ── */}
      <div
        className="border-t max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
        style={{ borderColor: "rgba(255,255,255,.08)" }}
      >
        {/* Newsletter */}
        <div className="flex-1 max-w-md">
          <h4
            className="text-sm font-semibold mb-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Stay in Bloom
          </h4>
          <p
            className="text-xs mb-3"
            style={{ color: "rgba(255,255,255,.4)", fontFamily: "'DM Sans', sans-serif" }}
          >
            New arrivals, seasonal picks &amp; exclusive offers — straight to your inbox.
          </p>

          {subscribed ? (
            <p
              className="text-sm font-medium"
              style={{ color: C.mint, fontFamily: "'DM Sans', sans-serif" }}
            >
              🌿 Thanks for subscribing!
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex rounded-full overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,.15)" }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:opacity-40"
                style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}
                required
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
                style={{ background: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
              >
                Subscribe <ArrowRight size={12} />
              </button>
            </form>
          )}
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-3">
          {SOCIAL.map(({ Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150"
              style={{
                border: "1px solid rgba(255,255,255,.15)",
                color: "rgba(255,255,255,.55)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.emerald;
                e.currentTarget.style.borderColor = C.emerald;
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255,255,255,.15)";
                e.currentTarget.style.color = "rgba(255,255,255,.55)";
              }}
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="border-t px-6 md:px-12 py-5"
        style={{ borderColor: "rgba(255,255,255,.06)" }}
      >
        <div
          className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
          style={{ color: "rgba(255,255,255,.28)", fontFamily: "'DM Sans', sans-serif" }}
        >
          <span>© 2025 Smagyo Inc. All rights reserved.</span>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Preferences"].map((t) => (
              <Link
                key={t}
                to="#"
                className="hover:text-white transition-colors"
                style={{ color: "rgba(255,255,255,.28)" }}
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

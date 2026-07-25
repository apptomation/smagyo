import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Leaf } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const C = {
  charcoal: "#1C1C1C",
  emerald: "#2D6A4F",
  sage: "#52796F",
  cream: "#FAF7F2",
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ?? "/";
  const notice = location.state?.notice;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.ok) navigate(from, { replace: true });
      else setError(result.error ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[80vh] flex items-center justify-center px-6 py-16"
      style={{ background: C.cream }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.charcoal }}
          >
            Welcome Back
          </h1>
          <p className="text-sm" style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}>
            Sign in to continue to checkout
          </p>
        </div>

        {notice && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-xl mb-4">
            {notice}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 space-y-4"
          style={{ border: "1px solid rgba(45,106,79,.08)" }}
        >
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: C.sage }}>Email address</label>
            <input
              type="email" required autoComplete="email" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 transition"
              style={{ borderColor: "rgba(45,106,79,.15)", color: C.charcoal }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: C.sage }}>Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"} required autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-xl border text-sm outline-none focus:ring-2 transition"
                style={{ borderColor: "rgba(45,106,79,.15)", color: C.charcoal }}
              />
              <button
                type="button" onClick={() => setShowPw((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2"
                style={{ color: C.sage }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
          >
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <LogIn size={15} />}
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}>
          New here?{" "}
          <Link to="/register" state={{ from }} className="font-semibold" style={{ color: C.emerald }}>
            Create an account
          </Link>
        </p>

        <div
          className="mt-6 mx-auto w-fit flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
          style={{ background: "rgba(45,106,79,.08)", color: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
        >
          <Leaf size={10} /> <Link to="/">Back to shopping</Link>
        </div>
      </div>
    </div>
  );
}

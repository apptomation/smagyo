import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Eye, EyeOff, LogIn, UserPlus, CheckCircle } from "lucide-react";
import { useAdminAuth, DEMO_ACCOUNTS } from "../context/AdminAuthContext";
import * as authApi from "../../api/authApi";

const ROLE_STYLE = {
  SUPER_ADMIN:  { label: "Super Admin",  color: "bg-purple-100 text-purple-700",   border: "border-purple-200" },
  TENANT_ADMIN: { label: "Store Admin",  color: "bg-emerald-100 text-emerald-700", border: "border-emerald-200" },
};

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-400">{label}</label>
      {children}
    </div>
  );
}

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const navigate  = useNavigate();

  const [tab, setTab] = useState("login"); // "login" | "register"

  // ── Login state ───────────────────────────────────────────────────────────
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPw,       setShowPw]       = useState(false);
  const [loginErr,     setLoginErr]     = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginErr("");
    setLoginLoading(true);
    try {
      const result = await login(email.trim().toLowerCase(), password);
      if (result.ok) navigate(result.role === "TENANT_ADMIN" ? "/tenant" : "/admin", { replace: true });
      else setLoginErr(result.error ?? "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const quickFill = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setLoginErr("");
    setTab("login");
  };

  // ── Register state ────────────────────────────────────────────────────────
  const [regName,      setRegName]      = useState("");
  const [regEmail,     setRegEmail]     = useState("");
  const [regPassword,  setRegPassword]  = useState("");
  const [storeName,    setStoreName]    = useState("");
  const [subdomain,    setSubdomain]    = useState("");
  const [showRegPw,    setShowRegPw]    = useState(false);
  const [regErr,       setRegErr]       = useState("");
  const [regLoading,   setRegLoading]   = useState(false);
  const [regSuccess,   setRegSuccess]   = useState(false);

  const handleStoreName = (e) => {
    const val = e.target.value;
    setStoreName(val);
    setSubdomain(
      val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").substring(0, 30)
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegErr("");
    setRegLoading(true);
    try {
      await authApi.register({ name: regName, email: regEmail, password: regPassword, storeName, subdomain });
      setRegSuccess(true);
      setTimeout(() => {
        setTab("login");
        setEmail(regEmail);
        setPassword("");
        setRegSuccess(false);
        setRegName(""); setRegEmail(""); setRegPassword(""); setStoreName(""); setSubdomain("");
      }, 2200);
    } catch (err) {
      setRegErr(err.message);
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-5">

        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <span className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Leaf size={18} color="#fff" strokeWidth={2.5} />
            </span>
            <span className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              smag<span className="text-emerald-400">yo</span>
            </span>
          </div>
          <p className="text-sm text-slate-400">Flower E-Commerce Platform</p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
          {[
            { id: "login",    icon: LogIn,    label: "Sign In" },
            { id: "register", icon: UserPlus, label: "Create Account" },
          ].map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => { setTab(id); setLoginErr(""); setRegErr(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === id ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* ── SIGN IN ─────────────────────────────────────────────────────── */}
        {tab === "login" && (
          <>
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 text-center">Demo accounts — click to fill</p>
              <div className="grid grid-cols-2 gap-3">
                {DEMO_ACCOUNTS.map((acc) => {
                  const cfg = ROLE_STYLE[acc.role] ?? {};
                  return (
                    <button key={acc.email} onClick={() => quickFill(acc)}
                      className={`flex flex-col items-start gap-1 p-3.5 rounded-xl border bg-slate-900 hover:bg-slate-800 transition-colors text-left ${cfg.border}`}>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                      <p className="text-xs font-semibold text-white mt-1">{acc.name}</p>
                      <p className="text-[10px] text-slate-400 truncate w-full">{acc.email}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleLogin} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
              <Field label="Email address">
                <input type="email" required autoComplete="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition" />
              </Field>

              <Field label="Password">
                <div className="relative">
                  <input type={showPw ? "text" : "password"} required autoComplete="current-password"
                    value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition" />
                  <button type="button" onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>

              {loginErr && <p className="text-xs text-red-400 bg-red-950/50 border border-red-900 px-4 py-2.5 rounded-xl">{loginErr}</p>}

              <button type="submit" disabled={loginLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-sm font-semibold transition-colors">
                {loginLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <LogIn size={16} />}
                {loginLoading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          </>
        )}

        {/* ── REGISTER ────────────────────────────────────────────────────── */}
        {tab === "register" && (
          <form onSubmit={handleRegister} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
            <p className="text-xs text-slate-500 pb-2 border-b border-slate-800">
              Creates a new flower company account (Store Admin)
            </p>

            {regSuccess ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <CheckCircle size={44} className="text-emerald-400" />
                <p className="text-sm font-semibold text-white">Account created!</p>
                <p className="text-xs text-slate-400">Redirecting to sign in…</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Your full name">
                    <input required value={regName} onChange={(e) => setRegName(e.target.value)}
                      placeholder="Alice Johnson" autoComplete="name"
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition" />
                  </Field>
                  <Field label="Email">
                    <input required type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="alice@shop.com" autoComplete="email"
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition" />
                  </Field>
                </div>

                <Field label="Password">
                  <div className="relative">
                    <input required type={showRegPw ? "text" : "password"} value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)} placeholder="Min. 6 characters"
                      autoComplete="new-password" minLength={6}
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition" />
                    <button type="button" onClick={() => setShowRegPw((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      {showRegPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </Field>

                <Field label="Store name">
                  <input required value={storeName} onChange={handleStoreName}
                    placeholder="Rose Garden Shop" autoComplete="organization"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition" />
                </Field>

                <Field label="Subdomain">
                  <div className="flex rounded-xl overflow-hidden border border-slate-700 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/30 transition">
                    <input required value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      placeholder="rosegarden" pattern="^[a-z0-9-]{2,30}$"
                      title="2–30 lowercase letters, digits, or hyphens"
                      className="flex-1 px-4 py-3 bg-slate-800 text-sm text-white placeholder-slate-500 outline-none" />
                    <span className="px-3 flex items-center text-xs text-slate-500 bg-slate-800 border-l border-slate-700 whitespace-nowrap">.smagyo.com</span>
                  </div>
                </Field>

                {regErr && <p className="text-xs text-red-400 bg-red-950/50 border border-red-900 px-4 py-2.5 rounded-xl">{regErr}</p>}

                <button type="submit" disabled={regLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-sm font-semibold transition-colors">
                  {regLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus size={16} />}
                  {regLoading ? "Creating account…" : "Create Account"}
                </button>
              </>
            )}
          </form>
        )}

        <p className="text-center text-xs text-slate-600">
          API: <code className="text-slate-500">localhost:8080</code>
        </p>
      </div>
    </div>
  );
}

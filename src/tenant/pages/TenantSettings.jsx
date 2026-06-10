import { useState } from "react";
import { Save, Globe, Palette, Bell, Shield } from "lucide-react";
import { useAdminAuth } from "../../admin/context/AdminAuthContext";

const TABS = [
  { id: "store",    label: "Store Info",    icon: Globe },
  { id: "branding", label: "Branding",      icon: Palette },
  { id: "notif",    label: "Notifications", icon: Bell },
  { id: "security", label: "Security",      icon: Shield },
];

function SectionCard({ title, description, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-50">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="grid sm:grid-cols-3 gap-3 items-start">
      <div>
        <p className="text-xs font-semibold text-slate-600">{label}</p>
        {hint && <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{hint}</p>}
      </div>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition"
    />
  );
}

function Toggle({ value, onChange, label }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-600">{label}</p>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${value ? "bg-emerald-500" : "bg-slate-200"}`}
        role="switch"
        aria-checked={value}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

export default function TenantSettings() {
  const { user } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("store");
  const [saved, setSaved] = useState(false);

  const [storeName,    setStoreName]    = useState(user.tenantName);
  const [storeEmail,   setStoreEmail]   = useState(user.email);
  const [storePhone,   setStorePhone]   = useState("+1 (800) 555-0100");
  const [storeAddress, setStoreAddress] = useState("21 Bloom Street, New York, NY 10001");
  const [customDomain, setCustomDomain] = useState("myflowers.com");

  const [primaryColor, setPrimaryColor] = useState("#2D6A4F");
  const [accentColor,  setAccentColor]  = useState("#84A98C");
  const [storeLogo,    setStoreLogo]    = useState("🌹");

  const [notifOrders,      setNotifOrders]      = useState(true);
  const [notifLowStock,    setNotifLowStock]    = useState(true);
  const [notifNewCustomer, setNotifNewCustomer] = useState(false);
  const [notifMarketing,   setNotifMarketing]   = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-400 mt-0.5">Manage your store configuration</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 whitespace-nowrap ${
              activeTab === id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Store Info */}
      {activeTab === "store" && (
        <SectionCard title="Store Information" description="Used in your storefront, invoices, and customer emails.">
          <Field label="Store Name" hint="Displayed in the navbar and page titles">
            <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="My Flower Shop" />
          </Field>
          <Field label="Contact Email" hint="Customers will reply to this address">
            <Input type="email" value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} />
          </Field>
          <Field label="Phone Number">
            <Input value={storePhone} onChange={(e) => setStorePhone(e.target.value)} />
          </Field>
          <Field label="Address">
            <Input value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} />
          </Field>
          <Field label="Custom Domain" hint="Your store is also available at yourname.smagyo.com">
            <Input value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} placeholder="myflowers.com" />
            <p className="text-[10px] text-slate-400 mt-1.5">
              Point your domain's DNS CNAME to <code className="bg-slate-100 px-1 rounded">stores.smagyo.com</code>
            </p>
          </Field>
        </SectionCard>
      )}

      {/* Branding */}
      {activeTab === "branding" && (
        <SectionCard title="Store Branding" description="Customize the look of your storefront.">
          <Field label="Store Logo Emoji" hint="Used as a placeholder until you upload an image">
            <div className="flex gap-2 flex-wrap">
              {["🌹", "🌷", "🌸", "💐", "🌻", "🌺", "🌿", "🪴", "🍃", "🌱"].map((e) => (
                <button
                  key={e}
                  onClick={() => setStoreLogo(e)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition-all ${
                    storeLogo === e ? "border-emerald-500 bg-emerald-50" : "border-transparent hover:border-slate-200"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Primary Color" hint="Used for buttons, links, and accents">
            <div className="flex items-center gap-3">
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer" />
              <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} placeholder="#2D6A4F" />
            </div>
          </Field>
          <Field label="Accent Color" hint="Used for secondary elements and highlights">
            <div className="flex items-center gap-3">
              <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer" />
              <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} placeholder="#84A98C" />
            </div>
          </Field>
          {/* Live preview */}
          <div className="rounded-2xl border border-slate-100 p-5 bg-slate-50">
            <p className="text-xs font-semibold text-slate-400 mb-3">Live Preview</p>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl" style={{ background: primaryColor }}>
                {storeLogo}
              </span>
              <span className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#1C1C1C" }}>
                {storeName}
              </span>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="px-5 py-2 rounded-full text-sm font-semibold text-white" style={{ background: primaryColor }}>
                Shop Now
              </button>
              <button className="px-5 py-2 rounded-full text-sm font-semibold border" style={{ borderColor: primaryColor, color: primaryColor }}>
                View Cart
              </button>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Notifications */}
      {activeTab === "notif" && (
        <SectionCard title="Email Notifications" description="Choose which events trigger an email to you.">
          <Toggle value={notifOrders}      onChange={setNotifOrders}      label="New order placed" />
          <Toggle value={notifLowStock}    onChange={setNotifLowStock}    label="Low stock alert (≤ 5 units)" />
          <Toggle value={notifNewCustomer} onChange={setNotifNewCustomer} label="New customer registered" />
          <Toggle value={notifMarketing}   onChange={setNotifMarketing}   label="Smagyo platform updates & tips" />
        </SectionCard>
      )}

      {/* Security */}
      {activeTab === "security" && (
        <SectionCard title="Password & Security" description="Keep your account secure.">
          <Field label="Current password">
            <Input type="password" value="" onChange={() => {}} placeholder="••••••••" />
          </Field>
          <Field label="New password">
            <Input type="password" value="" onChange={() => {}} placeholder="••••••••" />
          </Field>
          <Field label="Confirm new password">
            <Input type="password" value="" onChange={() => {}} placeholder="••••••••" />
          </Field>
          <Field label="Two-factor authentication" hint="Adds an extra layer of security">
            <button className="px-5 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
              Enable 2FA
            </button>
          </Field>
        </SectionCard>
      )}

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 ${
            saved ? "bg-emerald-500 scale-95" : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          <Save size={15} />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

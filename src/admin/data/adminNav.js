// Role: "tenant_admin" = flower company owner
// Role: "super_admin"  = Smagyo platform team

export const TENANT_ADMIN_NAV = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard",  href: "/tenant",            icon: "LayoutDashboard" },
    ],
  },
  {
    section: "Catalog",
    items: [
      { label: "Products",   href: "/tenant/products",   icon: "Flower2" },
    ],
  },
  {
    section: "Sales",
    items: [
      { label: "Orders",     href: "/tenant/orders",     icon: "ShoppingBag" },
    ],
  },
  {
    section: "Store",
    items: [
      { label: "Settings",   href: "/tenant/settings",   icon: "Settings" },
    ],
  },
];

export const SUPER_ADMIN_NAV = [
  {
    section: "Platform",
    items: [
      { label: "Dashboard",   href: "/admin",             icon: "LayoutDashboard" },
      { label: "Tenants",     href: "/admin/tenants",     icon: "Building2" },
      { label: "Billing",     href: "/admin/billing",     icon: "CreditCard" },
    ],
  },
  {
    section: "Monitor",
    items: [
      { label: "All Orders",   href: "/admin/orders",     icon: "ShoppingBag" },
      { label: "All Products", href: "/admin/products",   icon: "Flower2" },
      { label: "Users",        href: "/admin/customers",  icon: "Users" },
      { label: "Analytics",    href: "/admin/analytics",  icon: "BarChart3" },
    ],
  },
  {
    section: "Config",
    items: [
      { label: "Settings",    href: "/admin/settings",    icon: "Settings" },
    ],
  },
];

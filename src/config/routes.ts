/**
 * 🏛️ مرجع المسارات المركزي
 * لتغيير مسار أي صفحة — عدّل هنا فقط.
 */

export const ROUTES = {
  public: {
    home: "/",
    about: "/about",
    contact: "/contact",
    terms: "/terms",
    offers: "/offers",
    checkout: "/checkout",
    products: "/products",
    product: (slug: string) => `/products/${slug}`,
    store: (slug: string) => `/store/${slug}`,
    designPreview: "/design-preview",
  },

  auth: {
    login: "/login",
    register: "/register",
  },

  admin: {
    home: "/admin/home",
    overview: "/admin/overview",
    analytics: "/admin/analytics",
    auditLogs: "/admin/audit-logs",
    commissions: "/admin/commissions",
    coupons: "/admin/coupons",
    disputes: "/admin/disputes",
    matching: "/admin/matching",
    payments: "/admin/payments",
    payouts: "/admin/payouts",
    refunds: "/admin/refunds",
    requests: "/admin/requests",
    settings: "/admin/settings",
    users: "/admin/users",
  },

  wholesale: {
    overview: "/wholesale/overview",
    products: "/wholesale/products",
    inventory: "/wholesale/inventory",
    orders: "/wholesale/orders",
    payouts: "/wholesale/payouts",
    commissions: "/wholesale/commissions",
    deliveryRequests: "/wholesale/delivery-requests",
    nearbyRequests: "/wholesale/nearby-requests",
    settings: "/wholesale/settings",
  },

  retailer: {
    overview: "/retailer/overview",
    cart: "/retailer/cart",
    orders: "/retailer/orders",
    invoices: "/retailer/invoices",
    favorites: "/retailer/favorites",
    points: "/retailer/points",
    commissions: "/retailer/commissions",
    nearbyWholesale: "/retailer/nearby-wholesale",
    settings: "/retailer/settings",
  },

  delivery: {
    overview: "/delivery/overview",
    tasks: "/delivery/tasks",
    taskHistory: "/delivery/task-history",
    earnings: "/delivery/earnings",
    payouts: "/delivery/payouts",
    commissions: "/delivery/commissions",
    myWholesalers: "/delivery/my-wholesalers",
    nearbyWholesale: "/delivery/nearby-wholesale",
    settings: "/delivery/settings",
  },

  shared: {
    messages: "/messages",
  },
} as const;

export function getDashboardPath(role: string): string {
  switch (role) {
    case "admin":
      return ROUTES.admin.home;
    case "supplier":
      return ROUTES.wholesale.overview;
    case "delivery":
      return ROUTES.delivery.overview;
    case "retailer":
    default:
      return ROUTES.retailer.overview;
  }
}

export const ADMIN_LAST_DASHBOARD_PATH_KEY = "admin:last-dashboard-path";
export const ADMIN_PRODUCTS_UI_KEY = "admin:products-ui";

const DEFAULT_ADMIN_PATH = "/";

export const normalizeAdminPath = (path) => {
  if (!path || path === "/dashboard" || path === "/dashboard/dashboard") {
    return DEFAULT_ADMIN_PATH;
  }

  if (path.startsWith("/dashboard/")) {
    return path.replace(/^\/dashboard/, "") || DEFAULT_ADMIN_PATH;
  }

  return path;
};

export const getSavedDashboardPath = () => {
  if (typeof window === "undefined") return DEFAULT_ADMIN_PATH;
  const saved = localStorage.getItem(ADMIN_LAST_DASHBOARD_PATH_KEY);
  return saved ? normalizeAdminPath(saved) : DEFAULT_ADMIN_PATH;
};

export const saveDashboardPath = (path) => {
  if (typeof window === "undefined") return;
  if (!path || path.startsWith("/auth")) return;
  localStorage.setItem(ADMIN_LAST_DASHBOARD_PATH_KEY, normalizeAdminPath(path));
};

export const getSavedProductsUi = () => {
  if (typeof window === "undefined") {
    return {
      role: "producer",
      status: "all",
      sort: "Newest-Oldest",
      search: "",
    };
  }

  try {
    const parsed = JSON.parse(localStorage.getItem(ADMIN_PRODUCTS_UI_KEY) || "{}");
    return {
      role: parsed.role || "producer",
      status: parsed.status || "all",
      sort: parsed.sort || "Newest-Oldest",
      search: parsed.search || "",
    };
  } catch {
    return {
      role: "producer",
      status: "all",
      sort: "Newest-Oldest",
      search: "",
    };
  }
};

export const saveProductsUi = (state) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_PRODUCTS_UI_KEY, JSON.stringify(state));
};

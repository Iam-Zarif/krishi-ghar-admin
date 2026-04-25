export const ADMIN_LAST_DASHBOARD_PATH_KEY = "admin:last-dashboard-path";
export const ADMIN_PRODUCTS_UI_KEY = "admin:products-ui";

export const getSavedDashboardPath = () => {
  if (typeof window === "undefined") return "/dashboard/dashboard";
  const saved = localStorage.getItem(ADMIN_LAST_DASHBOARD_PATH_KEY);
  return saved && saved.startsWith("/dashboard/")
    ? saved
    : "/dashboard/dashboard";
};

export const saveDashboardPath = (path) => {
  if (typeof window === "undefined") return;
  if (!path?.startsWith("/dashboard/")) return;
  localStorage.setItem(ADMIN_LAST_DASHBOARD_PATH_KEY, path);
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

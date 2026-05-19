import { Api } from "../../../Api/Api";

export const STATUS_TABS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export const SORT_OPTIONS = [
  { value: "latest", label: "Newest to oldest" },
  { value: "oldest", label: "Oldest to newest" },
  { value: "amount-high", label: "Amount high to low" },
  { value: "amount-low", label: "Amount low to high" },
  { value: "name", label: "Product name A-Z" },
];

export const rowsPerPage = 10;

export const formatMoney = (value) =>
  `৳ ${Number(value || 0).toLocaleString("en-BD")}`;

export const formatDate = (value) => {
  if (!value) return "N/A";

  return new Date(value).toLocaleString("bn-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const resolveProductImage = (value) => {
  const image = String(value || "").trim();
  if (!image) return "https://placehold.co/80x80?text=No+Image";
  if (/^https?:\/\//i.test(image)) return image;
  return `${Api}/${image.replace(/^\/+/, "")}`;
};

export const productOwner = (product) => product?.producer || {};

export const normalizeStatus = (product) =>
  String(product?.status || "pending").toLowerCase();

export const statusClassName = (status) => {
  const value = String(status || "").toLowerCase();

  if (value === "approved") {
    return "bg-green-100 text-green-700";
  }

  if (value === "rejected") {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-700";
};

export const matchesQuery = (product, query) => {
  if (!query) return true;

  const owner = productOwner(product);
  const values = [
    product?._id,
    product?.productName,
    product?.status,
    product?.category?.name,
    typeof product?.category === "string" ? product.category : "",
    owner?.name,
    owner?.phone,
    owner?.district,
    owner?.thana,
  ];

  return values.filter(Boolean).join(" ").toLowerCase().includes(query);
};

const productAmount = (product) => Number(product?.price || 0);

const productTime = (product) => {
  const timestamp = new Date(product?.createdAt || product?.updatedAt || 0).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const sortProducts = (products, sortOption) => {
  const nextProducts = [...products];

  if (sortOption === "oldest") {
    return nextProducts.sort((first, second) => productTime(first) - productTime(second));
  }

  if (sortOption === "amount-high") {
    return nextProducts.sort((first, second) => productAmount(second) - productAmount(first));
  }

  if (sortOption === "amount-low") {
    return nextProducts.sort((first, second) => productAmount(first) - productAmount(second));
  }

  if (sortOption === "name") {
    return nextProducts.sort((first, second) =>
      String(first?.productName || "").localeCompare(String(second?.productName || "")),
    );
  }

  return nextProducts.sort((first, second) => productTime(second) - productTime(first));
};

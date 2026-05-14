export const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "purchased", label: "Purchased" },
];

export const SORT_OPTIONS = [
  { value: "latest", label: "Newest to oldest" },
  { value: "oldest", label: "Oldest to newest" },
  { value: "amount-high", label: "Amount high to low" },
  { value: "amount-low", label: "Amount low to high" },
  { value: "pending-first", label: "Status - pending first" },
  { value: "purchased-first", label: "Status - purchased first" },
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

export const normalizeStatus = (order) =>
  String(
    order?.adminActionStatus ||
      order?.orderStatus ||
      order?.status ||
      "pending",
  ).toLowerCase();

export const statusClassName = (status) => {
  const value = String(status || "").toLowerCase();

  if (value === "purchased" || value === "delivered" || value === "paid") {
    return "bg-green-100 text-green-700";
  }

  if (value === "cancelled" || value === "rejected") {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-700";
};

export const productFromItem = (item) =>
  item?.productId && typeof item.productId === "object" ? item.productId : {};

export const getProductNames = (items) =>
  (Array.isArray(items) ? items : [])
    .map((item) => {
      const product = productFromItem(item);
      return item?.productName || product?.productName || "নামহীন পণ্য";
    })
    .join(", ");

export const getProductImage = (items) => {
  const firstItem = Array.isArray(items) ? items[0] : null;
  const product = productFromItem(firstItem);

  return (
    firstItem?.productImage ||
    product?.image ||
    "https://placehold.co/80x80?text=No+Image"
  );
};

export const getQuantityLabel = (items) =>
  (Array.isArray(items) ? items : [])
    .map((item) => {
      const product = productFromItem(item);
      const unit = product?.unit || item?.unit || "";
      return `${item?.quantity || 0}${unit ? ` ${unit}` : ""}`;
    })
    .join(", ");

export const matchesQuery = (order, query) => {
  if (!query) return true;

  const buyer = order?.userId || {};
  const values = [
    order?._id,
    order?.orderId,
    normalizeStatus(order),
    buyer?.name,
    buyer?.phone,
    buyer?.district,
    buyer?.thana,
    getProductNames(order?.items),
  ];

  return values.filter(Boolean).join(" ").toLowerCase().includes(query);
};

const orderAmount = (order) => Number(order?.totalAmount || order?.subtotal || 0);

const orderTime = (order) => {
  const timestamp = new Date(order?.createdAt || 0).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const sortOrders = (orders, sortOption) => {
  const nextOrders = [...orders];

  if (sortOption === "oldest") {
    return nextOrders.sort((first, second) => orderTime(first) - orderTime(second));
  }

  if (sortOption === "amount-high") {
    return nextOrders.sort((first, second) => orderAmount(second) - orderAmount(first));
  }

  if (sortOption === "amount-low") {
    return nextOrders.sort((first, second) => orderAmount(first) - orderAmount(second));
  }

  if (sortOption === "pending-first") {
    return nextOrders.sort((first, second) => {
      const firstPending = normalizeStatus(first) === "pending" ? 0 : 1;
      const secondPending = normalizeStatus(second) === "pending" ? 0 : 1;
      return firstPending - secondPending || orderTime(second) - orderTime(first);
    });
  }

  if (sortOption === "purchased-first") {
    return nextOrders.sort((first, second) => {
      const firstPurchased = normalizeStatus(first) === "purchased" ? 0 : 1;
      const secondPurchased = normalizeStatus(second) === "purchased" ? 0 : 1;
      return firstPurchased - secondPurchased || orderTime(second) - orderTime(first);
    });
  }

  return nextOrders.sort((first, second) => orderTime(second) - orderTime(first));
};

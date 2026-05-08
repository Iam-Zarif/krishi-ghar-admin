import axios from "axios";
import { Api } from "../Api/Api";

const buildConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const getOwnerData = (product) => {
  if (product?.producer?._id) return { role: "producer", info: product.producer };
  if (product?.supersaler?._id) return { role: "supersaler", info: product.supersaler };
  if (product?.wholesaler?._id) return { role: "wholesaler", info: product.wholesaler };
  return { role: "unknown", info: null };
};

const priceNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const resolveImage = (value) => {
  if (!value) {
    return "https://placehold.co/640x480?text=No+Image";
  }

  return String(value).startsWith("http") ? value : `${Api}/${value}`;
};

export const normalizeAdminProduct = (product = {}) => {
  const { role, info } = getOwnerData(product);

  return {
    ...product,
    ownerRole: role,
    ownerInfo: info,
    safeName: String(product?.productName || "Unnamed product").trim(),
    safePrice: priceNumber(product?.price),
    safeQuantity: String(product?.quantity || "0"),
    safeImage: resolveImage(product?.image),
    secondaryImages: Array.isArray(product?.secondaryImages)
      ? product.secondaryImages.map(resolveImage)
      : [],
    safeCategory:
      product?.category?.name || product?.categoryName || product?.category || "Uncategorized",
    safeStatus: String(product?.status || "pending").toLowerCase(),
    safeSellPost:
      String(product?.addToSellPost || "").toLowerCase() === "yes" ||
      product?.addToSellPost === true,
  };
};

export const normalizeAdminSellPost = (post = {}) => {
  const product = post.product || {};
  const seller = post.seller || {};
  const producer = post.producer || {};

  return {
    ...post,
    _id: post._id,
    ownerRole: "sell-post",
    ownerInfo: seller,
    producerInfo: producer,
    safeName: String(product.productName || post.productName || "Sell post").trim(),
    safePrice: priceNumber(post.sellingPricePerKg),
    safeQuantity: `${post.quantity || 0} ${post.unit || ""}`.trim(),
    safeImage: resolveImage(product.image),
    secondaryImages: Array.isArray(product.secondaryImages)
      ? product.secondaryImages.map(resolveImage)
      : [],
    safeCategory: post.sellType || "sell post",
    safeStatus: post.isActive === false ? "inactive" : "active",
    safeSellPost: true,
    description: `Visibility: ${post.visibility || "N/A"}`,
    basePricePerKg: post.basePricePerKg,
    sellingPricePerKg: post.sellingPricePerKg,
    commissionPercent: post.commissionPercent,
    totalCommission: post.totalCommission,
    remainingQuantity: post.remainingQuantity,
    soldQuantity: post.soldQuantity,
    visibility: post.visibility,
    sellType: post.sellType,
  };
};

const getProductsFromResponse = (data) =>
  Array.isArray(data?.products) ? data.products.map(normalizeAdminProduct) : [];

export const fetchAdminProductsByStatus = async ({ token, status }) => {
  const endpoint =
    status === "pending"
      ? "/api/v1/admin/products/pending"
      : status === "approved"
        ? "/api/v1/admin/products/approved"
        : status === "rejected"
          ? "/api/v1/admin/products/rejected"
          : "/api/v1/admin/products/all";

  const response = await axios.get(`${Api}${endpoint}`, buildConfig(token));
  return getProductsFromResponse(response.data);
};

export const fetchAdminProductDetails = async ({ token, productId }) => {
  const response = await axios.get(
    `${Api}/api/v1/admin/products/${productId}`,
    buildConfig(token),
  );

  return normalizeAdminProduct(response.data?.product || {});
};

export const approveAdminProduct = async ({ token, productId }) => {
  const response = await axios.put(
    `${Api}/api/v1/admin/products/approve/${productId}`,
    {},
    buildConfig(token),
  );

  return normalizeAdminProduct(response.data?.product || {});
};

export const rejectAdminProduct = async ({ token, productId }) => {
  const response = await axios.put(
    `${Api}/api/v1/admin/products/reject/${productId}`,
    {},
    buildConfig(token),
  );

  return normalizeAdminProduct(response.data?.product || {});
};

export const fetchAdminSellPosts = async ({ token }) => {
  const response = await axios.get(`${Api}/api/v1/admin/sell-posts`, buildConfig(token));
  return Array.isArray(response.data?.posts)
    ? response.data.posts.map(normalizeAdminSellPost)
    : [];
};

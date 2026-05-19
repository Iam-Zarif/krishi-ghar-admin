import axios from "axios";
import { Api } from "./Api";

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
  withCredentials: true,
});

export const fetchAdminSupersalerProductsByStatus = async ({ token, status }) => {
  const safeStatus = ["pending", "approved", "rejected"].includes(status)
    ? status
    : "pending";

  const response = await axios.get(
    `${Api}/api/v1/admin/supersaler-products/${safeStatus}`,
    authConfig(token),
  );

  return response.data;
};

export const approveAdminSupersalerProduct = async ({ token, productId }) => {
  const response = await axios.patch(
    `${Api}/api/v1/admin/supersaler-products/${productId}/approve`,
    {},
    authConfig(token),
  );

  return response.data;
};

export const rejectAdminSupersalerProduct = async ({ token, productId }) => {
  const response = await axios.patch(
    `${Api}/api/v1/admin/supersaler-products/${productId}/reject`,
    {},
    authConfig(token),
  );

  return response.data;
};

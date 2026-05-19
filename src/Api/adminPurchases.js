import axios from "axios";
import { Api } from "./Api";

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
  withCredentials: true,
});

const purchaseEndpointByRole = {
  supersaler: "/api/v1/admin/supersaler-purchases",
  wholesaler: "/api/v1/admin/wholesaler-purchases",
  producer: "/api/v1/admin/producer-purchases",
};

export const fetchAdminPurchasesByRole = async ({ token, role }) => {
  const endpoint = purchaseEndpointByRole[role];
  if (!endpoint) {
    throw new Error(`Unsupported purchase role: ${role}`);
  }

  const response = await axios.get(`${Api}${endpoint}`, authConfig(token));
  return response.data;
};

export const updateAdminPurchaseStatus = async ({
  token,
  orderId,
  orderStatus,
  paymentStatus,
}) => {
  const response = await axios.patch(
    `${Api}/api/v1/admin/update-status/${orderId}`,
    {
      orderStatus,
      paymentStatus,
    },
    authConfig(token),
  );

  return response.data;
};

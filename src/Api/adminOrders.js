import axios from "axios";
import { Api } from "./Api";

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
  withCredentials: true,
});

const orderStatusMap = {
  pending: "pending",
  confirmed: "confirmed",
  processing: "processing",
  completed: "completed",
  cancelled: "cancelled",
  purchased: "completed",
};

export const fetchSupersalerOrderedProductsByAdmin = async ({ token }) => {
  const response = await axios.get(
    `${Api}/api/v1/admin/view-supersaler-product`,
    authConfig(token),
  );

  return response.data;
};

export const updateSupersalerOrderStatusByAdmin = async ({
  token,
  orderId,
  status,
}) => {
  const orderStatus = orderStatusMap[status] || status;
  const response = await axios.patch(
    `${Api}/api/v1/admin/update-status/${orderId}`,
    { orderStatus },
    authConfig(token),
  );

  return response.data;
};

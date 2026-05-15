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
  _id,
  status,
}) => {
  const orderStatus = orderStatusMap[status] || status;

  // This is backend req.body
  const reqBody = {
    orderStatus,
  };

  // This is backend req.params.orderId
  const reqParams = {
    orderId: _id,
  };

  const url = `${Api}/api/v1/admin/update-status/${_id}`;
  const config = authConfig(token);

  console.log("========== FRONTEND TO BACKEND DEBUG ==========");
  console.log("Backend route expects:", "/update-status/:orderId");
  console.log("Frontend request URL:", url);

  console.log("req.params equivalent:", reqParams);
  console.log("req.params.orderId:", _id);

  console.log("Raw UI status:", status);
  console.log("Mapped backend orderStatus:", orderStatus);

  console.log("req.body equivalent:", reqBody);
  console.log("req.body.orderStatus:", reqBody.orderStatus);
  console.log("req.body.paymentStatus:", reqBody.paymentStatus);

  console.log("Token exists:", Boolean(token));
  console.log("Authorization header:", config.headers.Authorization);
  console.log("withCredentials:", config.withCredentials);
  console.log("==============================================");

  try {
    const response = await axios.patch(url, reqBody, config);

    console.log("========== BACKEND SUCCESS RESPONSE ==========");
    console.log("Status code:", response.status);
    console.log("Response data:", response.data);
    console.log("Updated order:", response.data?.order);
    console.log("Updated orderStatus:", response.data?.order?.orderStatus);
    console.log("Updated paymentStatus:", response.data?.order?.paymentStatus);
    console.log("=============================================");

    return response.data;
  } catch (error) {
    console.log("========== BACKEND ERROR RESPONSE ==========");
    console.log("Axios error full:", error);
    console.log("Error message:", error.message);

    console.log("Request URL:", url);
    console.log("Sent req.params equivalent:", reqParams);
    console.log("Sent req.body equivalent:", reqBody);

    console.log("Response exists:", Boolean(error.response));
    console.log("Response status:", error.response?.status);
    console.log("Response data:", error.response?.data);
    console.log("Backend error message:", error.response?.data?.message);
    console.log("Backend raw error:", error.response?.data?.error);

    console.log("CORS/network issue:", !error.response);
    console.log("===========================================");

    throw error;
  }
};

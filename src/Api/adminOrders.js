import axios from "axios";
import { Api } from "./Api";

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
  withCredentials: true,
});

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
  const response = await axios.patch(
    `${Api}/api/v1/admin/update-status/${_id}`,
    {
      status,
      orderStatus: status,
      adminActionStatus: status,
    },
    authConfig(token),
  );

  return response.data;
};

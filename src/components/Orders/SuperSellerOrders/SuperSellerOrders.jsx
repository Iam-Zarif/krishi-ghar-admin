import { useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  fetchSupersalerOrderedProductsByAdmin,
  updateSupersalerOrderStatusByAdmin,
} from "../../../Api/adminOrders";
import SuperSellerOrderDetailsModal from "./SuperSellerOrderDetailsModal";
import SuperSellerOrdersPagination from "./SuperSellerOrdersPagination";
import SuperSellerOrdersTable from "./SuperSellerOrdersTable";
import SuperSellerOrdersToolbar from "./SuperSellerOrdersToolbar";
import {
  matchesQuery,
  rowsPerPage,
  sortOrders,
} from "./supersellerOrderHelpers";

const SuperSellerOrders = () => {
  const token = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState("");
  const [detailsOrder, setDetailsOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState("");
  const menuRef = useRef(null);
  const loadedTokenRef = useRef("");
  const lastErrorToastRef = useRef("");

  const loadOrders = async () => {
    if (!token) {
      setError("অননুমোদিত প্রবেশ");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await fetchSupersalerOrderedProductsByAdmin({ token });
      console.log("admin supersaler ordered products response", response);
      setOrders(Array.isArray(response?.orders) ? response.orders : []);
    } catch (requestError) {
      const message =
        requestError?.response?.data?.message ||
        requestError?.message ||
        "সুপার সেলার অর্ডার লোড করা যায়নি";
      setError(message);
      if (lastErrorToastRef.current !== message) {
        toast.error(message);
        lastErrorToastRef.current = message;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loadedTokenRef.current === token) return;
    loadedTokenRef.current = token;
    loadOrders();
  }, [token]);

  useEffect(() => {
    const onOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId("");
      }
    };

    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortOption]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sortOrders(
      orders.filter((order) => matchesQuery(order, query)),
      sortOption,
    );
  }, [orders, search, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / rowsPerPage));
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handleMenuToggle = (orderId) => {
    setOpenMenuId((current) => (current === orderId ? "" : orderId));
  };

  const handleOpenDetails = (order) => {
    setDetailsOrder(order);
    setOpenMenuId("");
  };

const handleStatusUpdate = async (order, status) => {
  const _id = order?._id;

  console.log("========== UI CLICK DEBUG ==========");
  console.log("Clicked order full object:", order);
  console.log("Clicked order._id:", _id);
  console.log("Clicked UI status:", status);
  console.log("Token exists in component:", Boolean(token));
  console.log("===================================");

  if (!_id || !token) {
    console.log("UPDATE STOPPED BEFORE API CALL:", {
      hasOrderId: Boolean(_id),
      hasToken: Boolean(token),
      _id,
      status,
    });
    return;
  }

  try {
    setUpdatingId(_id);

    const response = await updateSupersalerOrderStatusByAdmin({
      token,
      _id,
      status,
    });

    console.log("admin supersaler order status update response", response);
    toast.success("অর্ডার স্ট্যাটাস আপডেট হয়েছে");

    setOrders((current) =>
      current.map((item) =>
        item._id === _id
          ? {
              ...item,
              orderStatus: response?.order?.orderStatus || item.orderStatus,
              paymentStatus:
                response?.order?.paymentStatus || item.paymentStatus,
            }
          : item,
      ),
    );

    setOpenMenuId("");
  } catch (requestError) {
    console.log("========== COMPONENT CATCH ERROR ==========");
    console.log("Error full:", requestError);
    console.log("Error message:", requestError?.message);
    console.log("Error response status:", requestError?.response?.status);
    console.log("Error response data:", requestError?.response?.data);
    console.log("=========================================");

    toast.error(
      requestError?.response?.data?.message ||
        requestError?.message ||
        "স্ট্যাটাস আপডেট করা যায়নি",
    );
  } finally {
    setUpdatingId("");
  }
};

  return (
    <div className="w-full p-6 text-gray-800">
      <ToastContainer />

      <SuperSellerOrdersToolbar
        count={filteredOrders.length}
        loading={loading}
        onRefresh={loadOrders}
        search={search}
        onSearchChange={setSearch}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />

      {loading ? (
        <div className="mt-6 rounded-lg bg-white p-8 text-center text-gray-500 shadow-md">
          সুপার সেলার অর্ডার লোড হচ্ছে...
        </div>
      ) : error ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      ) : currentOrders.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500 shadow-sm">
          কোনো সুপার সেলার অর্ডার পাওয়া যায়নি।
        </div>
      ) : (
        <SuperSellerOrdersTable
          currentPage={currentPage}
          menuRef={menuRef}
          onMenuToggle={handleMenuToggle}
          onOpenDetails={handleOpenDetails}
          onStatusUpdate={handleStatusUpdate}
          openMenuId={openMenuId}
          orders={currentOrders}
          rowsPerPage={rowsPerPage}
          updatingId={updatingId}
        />
      )}

      {!loading && !error && (
        <SuperSellerOrdersPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <SuperSellerOrderDetailsModal
        order={detailsOrder}
        onClose={() => setDetailsOrder(null)}
      />
    </div>
  );
};

export default SuperSellerOrders;

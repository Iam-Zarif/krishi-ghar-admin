import { useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  approveAdminSupersalerProduct,
  fetchAdminSupersalerProductsByStatus,
  rejectAdminSupersalerProduct,
} from "../../../Api/adminSupersalerProducts";
import SuperSellerOrderDetailsModal from "./SuperSellerOrderDetailsModal";
import SuperSellerOrdersPagination from "./SuperSellerOrdersPagination";
import SuperSellerOrdersTable from "./SuperSellerOrdersTable";
import SuperSellerOrdersToolbar from "./SuperSellerOrdersToolbar";
import {
  matchesQuery,
  rowsPerPage,
  sortProducts,
} from "./supersellerOrderHelpers";

const SuperSellerOrders = () => {
  const token = localStorage.getItem("token");
  const [products, setProducts] = useState([]);
  const [activeStatus, setActiveStatus] = useState("pending");
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState("");
  const [detailsProduct, setDetailsProduct] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const menuRef = useRef(null);
  const lastErrorToastRef = useRef("");

  const loadProducts = async () => {
    if (!token) {
      setError("অননুমোদিত প্রবেশ");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await fetchAdminSupersalerProductsByStatus({
        token,
        status: activeStatus,
      });
      setProducts(Array.isArray(response?.products) ? response.products : []);
    } catch (requestError) {
      const message =
        requestError?.response?.data?.message ||
        requestError?.message ||
        "সুপার সেলার পণ্য লোড করা যায়নি";
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
    loadProducts();
  }, [activeStatus, token]);

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
  }, [activeStatus, search, sortOption]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sortProducts(
      products.filter((product) => matchesQuery(product, query)),
      sortOption,
    );
  }, [products, search, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / rowsPerPage));
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handleMenuToggle = (productId) => {
    setOpenMenuId((current) => (current === productId ? "" : productId));
  };

  const handleOpenDetails = (product) => {
    setDetailsProduct(product);
    setOpenMenuId("");
  };

  const updateProductAfterAction = (productId, product) => {
    setProducts((current) =>
      current
        .map((item) => (item._id === productId ? product || item : item))
        .filter((item) => item.status === activeStatus),
    );
  };

  const handleApprove = async (product) => {
    if (!product?._id || !token) return;

    try {
      setActionLoadingId(product._id);
      const response = await approveAdminSupersalerProduct({
        token,
        productId: product._id,
      });
      toast.success(response?.message || "সুপার সেলার পণ্য অনুমোদিত হয়েছে");
      updateProductAfterAction(product._id, response?.product);
      setOpenMenuId("");
    } catch (requestError) {
      toast.error(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "পণ্য অনুমোদন করা যায়নি",
      );
    } finally {
      setActionLoadingId("");
    }
  };

  const handleReject = async (product) => {
    if (!product?._id || !token) return;

    try {
      setActionLoadingId(product._id);
      const response = await rejectAdminSupersalerProduct({
        token,
        productId: product._id,
      });
      toast.success(response?.message || "সুপার সেলার পণ্য বাতিল হয়েছে");
      updateProductAfterAction(product._id, response?.product);
      setOpenMenuId("");
    } catch (requestError) {
      toast.error(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "পণ্য বাতিল করা যায়নি",
      );
    } finally {
      setActionLoadingId("");
    }
  };

  return (
    <div className="w-full p-6 text-gray-800">
      <ToastContainer />

      <SuperSellerOrdersToolbar
        activeStatus={activeStatus}
        count={filteredProducts.length}
        loading={loading}
        onRefresh={loadProducts}
        onSearchChange={setSearch}
        onSortChange={setSortOption}
        onStatusChange={setActiveStatus}
        search={search}
        sortOption={sortOption}
      />

      {loading ? (
        <div className="mt-6 rounded-lg bg-white p-8 text-center text-gray-500 shadow-md">
          সুপার সেলার পণ্য লোড হচ্ছে...
        </div>
      ) : error ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      ) : currentProducts.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500 shadow-sm">
          কোনো সুপার সেলার পণ্য পাওয়া যায়নি।
        </div>
      ) : (
        <SuperSellerOrdersTable
          actionLoadingId={actionLoadingId}
          currentPage={currentPage}
          menuRef={menuRef}
          onApprove={handleApprove}
          onMenuToggle={handleMenuToggle}
          onOpenDetails={handleOpenDetails}
          onReject={handleReject}
          openMenuId={openMenuId}
          products={currentProducts}
          rowsPerPage={rowsPerPage}
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
        product={detailsProduct}
        onClose={() => setDetailsProduct(null)}
      />
    </div>
  );
};

export default SuperSellerOrders;

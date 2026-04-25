import { useEffect, useMemo, useRef, useState } from "react";
import { BsSearch, BsThreeDotsVertical } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { FaSort } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import {
  approveAdminProduct,
  fetchAdminProductDetails,
  fetchAdminProductsByStatus,
  rejectAdminProduct,
} from "../../api/productModeration";
import { getSavedProductsUi, saveProductsUi } from "../../utils/adminSession";

const ROLE_TABS = [
  { key: "producer", label: "প্রডিউসার" },
  { key: "supersaler", label: "সুপার-সেলার" },
  { key: "wholesaler", label: "হোলসেলার" },
];

const STATUS_TABS = [
  { key: "all", label: "সব পণ্য" },
  { key: "pending", label: "অপেক্ষমাণ" },
  { key: "approved", label: "অনুমোদিত" },
  { key: "rejected", label: "বাতিল" },
];

const SORT_OPTIONS = [
  { value: "A-Z", label: "নাম: অ-হ" },
  { value: "Z-A", label: "নাম: হ-অ" },
  { value: "Price Low-High", label: "দাম: কম থেকে বেশি" },
  { value: "Price High-Low", label: "দাম: বেশি থেকে কম" },
  { value: "Oldest-Newest", label: "পুরনো থেকে নতুন" },
  { value: "Newest-Oldest", label: "নতুন থেকে পুরনো" },
];

const formatMoney = (value) => `৳ ${Number(value || 0).toLocaleString("en-BD")}`;

const formatDate = (dateStr) => {
  if (!dateStr) return "প্রযোজ্য নয়";
  return new Date(dateStr).toLocaleString("bn-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusLabelMap = {
  pending: "অপেক্ষমাণ",
  approved: "অনুমোদিত",
  rejected: "বাতিল",
};

const StatusBadge = ({ status }) => {
  const value = String(status || "pending").toLowerCase();
  const className =
    value === "approved"
      ? "bg-green-100 text-green-700"
      : value === "rejected"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-700";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
      {statusLabelMap[value] || "অপেক্ষমাণ"}
    </span>
  );
};

const InlineActionButtons = ({ product, onApprove, onReject, actionLoading }) => {
  const isProcessing = actionLoading === product._id;

  if (product.safeStatus !== "pending") {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onApprove(product._id)}
        disabled={isProcessing}
        className="rounded-md bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-300 cursor-pointer"
      >
          {isProcessing ? "অপেক্ষা করুন..." : "অনুমোদন"}
      </button>
      <button
        type="button"
        onClick={() => onReject(product._id)}
        disabled={isProcessing}
        className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300 cursor-pointer"
      >
          {isProcessing ? "অপেক্ষা করুন..." : "বাতিল"}
      </button>
    </div>
  );
};

const TableSkeleton = () => (
  <div className="rounded-lg bg-white shadow-md overflow-hidden">
    <div className="grid grid-cols-[56px_80px_minmax(220px,1.4fr)_1fr_120px_120px_120px_180px] gap-3 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="h-4 rounded bg-gray-200 animate-pulse" />
      ))}
    </div>
    {Array.from({ length: 6 }).map((_, rowIndex) => (
      <div
        key={rowIndex}
        className="grid grid-cols-[56px_80px_minmax(220px,1.4fr)_1fr_120px_120px_120px_180px] gap-3 border-t border-gray-200 px-4 py-4"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-4 rounded bg-gray-100 animate-pulse" />
        ))}
      </div>
    ))}
  </div>
);

const EmptyState = ({ label }) => (
  <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-16 text-center text-gray-500 shadow-sm">
    {label} এর কোনো পণ্য পাওয়া যায়নি।
  </div>
);

const ConfirmActionModal = ({
  title,
  message,
  confirmText,
  confirmClassName,
  loading,
  onClose,
  onConfirm,
}) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-gray-500">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="rounded-full p-1 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed cursor-pointer"
        >
          <RxCross1 />
        </button>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed cursor-pointer"
        >
          বাতিল
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed ${confirmClassName} cursor-pointer`}
        >
          {loading ? "অপেক্ষা করুন..." : confirmText}
        </button>
      </div>
    </div>
  </div>
);

const ProductDetailsModal = ({ product, loading, onClose, onApprove, onReject, actionLoading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
    <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 cursor-pointer"
      >
        <RxCross1 />
      </button>

      {loading ? (
        <div className="p-8">
          <div className="h-8 w-48 rounded bg-gray-200 animate-pulse" />
          <div className="mt-6 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="h-72 rounded-lg bg-gray-100 animate-pulse" />
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-4 rounded bg-gray-100 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      ) : product ? (
        <div className="p-8">
          <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{product.safeName}</h2>
              <p className="mt-2 text-sm text-gray-500">{product._id}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={product.safeStatus} />
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                {ROLE_TABS.find((tab) => tab.key === product.ownerRole)?.label || product.ownerRole}
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="space-y-4">
              <img
                src={product.safeImage}
                alt={product.safeName}
                className="h-72 w-full rounded-lg border border-gray-200 object-cover"
              />
              {Array.isArray(product.secondaryImages) && product.secondaryImages.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {product.secondaryImages.slice(0, 3).map((image, index) => (
                    <img
                      key={`${image}-${index}`}
                      src={image}
                      alt={`${product.safeName} ${index + 1}`}
                      className="h-24 w-full rounded-lg border border-gray-200 object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">ক্যাটাগরি</p>
                  <p className="mt-2 text-lg font-semibold text-gray-800">{product.safeCategory}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">দাম</p>
                  <p className="mt-2 text-lg font-semibold text-green-700">{formatMoney(product.safePrice)}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">পরিমাণ</p>
                  <p className="mt-2 text-lg font-semibold text-gray-800">{product.safeQuantity}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">সেল পোস্ট</p>
                  <p className="mt-2 text-lg font-semibold text-gray-800">{product.safeSellPost ? "হ্যাঁ" : "না"}</p>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">মালিক</p>
                <p className="mt-2 text-lg font-semibold text-gray-800">
                  {product.ownerInfo?.name || "অজানা"}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {product.ownerInfo?.phone || "ফোন নেই"} • {product.ownerInfo?.email || "ইমেইল নেই"}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">বিবরণ</p>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
                  {product.description || "কোনো বিবরণ নেই"}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">তৈরির সময়</p>
                  <p className="mt-2 text-sm font-medium text-gray-800">{formatDate(product.createdAt)}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">আপডেটের সময়</p>
                  <p className="mt-2 text-sm font-medium text-gray-800">{formatDate(product.updatedAt)}</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                {product.safeStatus !== "approved" && (
                  <button
                    type="button"
                    onClick={() => onApprove(product._id)}
                    disabled={actionLoading}
                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300 cursor-pointer"
                  >
                    {actionLoading ? "অপেক্ষা করুন..." : "অনুমোদন"}
                  </button>
                )}
                {product.safeStatus !== "rejected" && (
                  <button
                    type="button"
                    onClick={() => onReject(product._id)}
                    disabled={actionLoading}
                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300 cursor-pointer"
                  >
                    {actionLoading ? "অপেক্ষা করুন..." : "বাতিল"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  </div>
);

const Products = () => {
  const savedUi = getSavedProductsUi();
  const token = localStorage.getItem("token");
  const [statusBuckets, setStatusBuckets] = useState({
    all: [],
    pending: [],
    approved: [],
    rejected: [],
  });
  const [search, setSearch] = useState(savedUi.search);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState(savedUi.sort);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [activeRole, setActiveRole] = useState(savedUi.role);
  const [activeStatus, setActiveStatus] = useState(savedUi.status);
  const [detailsProduct, setDetailsProduct] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [confirmState, setConfirmState] = useState(null);
  const dropdownRef = useRef(null);
  const itemsPerPage = 10;

  const loadProducts = async () => {
    if (!token) {
      setError("অননুমোদিত প্রবেশ");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const [all, pending, approved, rejected] = await Promise.all([
        fetchAdminProductsByStatus({ token, status: "all" }),
        fetchAdminProductsByStatus({ token, status: "pending" }),
        fetchAdminProductsByStatus({ token, status: "approved" }),
        fetchAdminProductsByStatus({ token, status: "rejected" }),
      ]);

      setStatusBuckets({ all, pending, approved, rejected });
    } catch (requestError) {
      const message =
        requestError?.response?.data?.message ||
        requestError?.message ||
        "পণ্য লোড করা যায়নি";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSortOpen(false);
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortOption, activeRole, activeStatus]);

  useEffect(() => {
    if (activeRole !== "producer" && activeStatus !== "all") {
      setActiveStatus("all");
    }
  }, [activeRole, activeStatus]);

  useEffect(() => {
    saveProductsUi({
      role: activeRole,
      status: activeStatus,
      sort: sortOption,
      search,
    });
  }, [activeRole, activeStatus, search, sortOption]);

  const shouldShowStatusTabs = activeRole === "producer";
  const activeStatusProducts =
    statusBuckets[shouldShowStatusTabs ? activeStatus : "all"] || [];

  const statusCounts = useMemo(
    () =>
      STATUS_TABS.reduce((acc, tab) => {
        acc[tab.key] = statusBuckets[tab.key]?.length || 0;
        return acc;
      }, {}),
    [statusBuckets],
  );

  const roleCounts = useMemo(
    () =>
      ROLE_TABS.reduce((acc, tab) => {
        acc[tab.key] = activeStatusProducts.filter((product) => product.ownerRole === tab.key).length;
        return acc;
      }, {}),
    [activeStatusProducts],
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    let next = activeStatusProducts.filter((product) => product.ownerRole === activeRole);

    if (query) {
      next = next.filter((product) => {
        const haystack = [
          product.safeName,
          product.safeCategory,
          product.description,
          product.ownerInfo?.name,
          product.ownerInfo?.phone,
          product.ownerInfo?.email,
          product.safeStatus,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(query);
      });
    }

    const sorted = [...next];
    switch (sortOption) {
      case "A-Z":
        sorted.sort((a, b) => a.safeName.localeCompare(b.safeName));
        break;
      case "Z-A":
        sorted.sort((a, b) => b.safeName.localeCompare(a.safeName));
        break;
      case "Price Low-High":
        sorted.sort((a, b) => a.safePrice - b.safePrice);
        break;
      case "Price High-Low":
        sorted.sort((a, b) => b.safePrice - a.safePrice);
        break;
      case "Oldest-Newest":
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "Newest-Oldest":
      default:
        sorted.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
        break;
    }

    return sorted;
  }, [activeRole, activeStatusProducts, search, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const updateProductInBuckets = (nextProduct) => {
    setStatusBuckets((prev) => {
      const buckets = Object.fromEntries(
        Object.entries(prev).map(([key, list]) => [
          key,
          list.filter((product) => product._id !== nextProduct._id),
        ]),
      );

      buckets.all = [nextProduct, ...buckets.all].sort(
        (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt),
      );
      buckets[nextProduct.safeStatus] = [
        nextProduct,
        ...(buckets[nextProduct.safeStatus] || []),
      ].sort(
        (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt),
      );

      return buckets;
    });

    setDetailsProduct((prev) => (prev?._id === nextProduct._id ? nextProduct : prev));
  };

  const handleOpenDetails = async (productId) => {
    try {
      setDetailsOpen(true);
      setDetailsLoading(true);
      setOpenDropdownId(null);
      const nextProduct = await fetchAdminProductDetails({ token, productId });
      setDetailsProduct(nextProduct);
    } catch (requestError) {
      toast.error(
        requestError?.response?.data?.message || requestError?.message || "Failed to fetch product details",
      );
      setDetailsOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleApprove = async (productId) => {
    try {
      setActionLoadingId(productId);
      const nextProduct = await approveAdminProduct({ token, productId });
      updateProductInBuckets(nextProduct);
      toast.success("পণ্য সফলভাবে অনুমোদিত হয়েছে");
    } catch (requestError) {
      toast.error(
        requestError?.response?.data?.message || requestError?.message || "পণ্য অনুমোদন করা যায়নি",
      );
    } finally {
      setActionLoadingId("");
    }
  };

  const handleReject = async (productId) => {
    try {
      setActionLoadingId(productId);
      const nextProduct = await rejectAdminProduct({ token, productId });
      updateProductInBuckets(nextProduct);
      toast.success("পণ্য সফলভাবে বাতিল হয়েছে");
    } catch (requestError) {
      toast.error(
        requestError?.response?.data?.message || requestError?.message || "পণ্য বাতিল করা যায়নি",
      );
    } finally {
      setActionLoadingId("");
    }
  };

  const requestRejectConfirmation = (product) => {
    setOpenDropdownId(null);
    setConfirmState({
      type: "reject",
      productId: product._id,
      productName: product.safeName,
    });
  };

  const handleConfirmReject = async () => {
    if (!confirmState?.productId) return;
    await handleReject(confirmState.productId);
    setConfirmState(null);
  };

  return (
    <div className="w-full p-6 text-gray-800">
      <ToastContainer />

      {confirmState?.type === "reject" && (
        <ConfirmActionModal
          title="পণ্য বাতিলের নিশ্চিতকরণ"
          message={`আপনি কি নিশ্চিত যে "${confirmState.productName}" পণ্যটি বাতিল করতে চান? এই কাজের পর পণ্যটি বাতিল তালিকায় চলে যাবে।`}
          confirmText="হ্যাঁ, বাতিল করুন"
          confirmClassName="bg-red-600 hover:bg-red-700 disabled:bg-red-300"
          loading={actionLoadingId === confirmState.productId}
          onClose={() => setConfirmState(null)}
          onConfirm={handleConfirmReject}
        />
      )}

      {detailsOpen && (
        <ProductDetailsModal
          product={detailsProduct}
          loading={detailsLoading}
          onClose={() => {
            setDetailsOpen(false);
            setDetailsProduct(null);
          }}
          onApprove={handleApprove}
          onReject={(productId) =>
            requestRejectConfirmation(detailsProduct?._id === productId ? detailsProduct : { _id: productId, safeName: detailsProduct?.safeName || "এই পণ্য" })
          }
          actionLoading={Boolean(actionLoadingId)}
        />
      )}

      <div className="rounded-lg bg-white px-6 py-5 shadow-md">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0 flex items-center gap-2 text-2xl font-bold text-gray-700">
            <h1>পণ্যসমূহ</h1>
            <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-500">
              {filteredProducts.length}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 xl:min-w-[640px] xl:grid-cols-[minmax(0,1fr)_220px]">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={`${ROLE_TABS.find((tab) => tab.key === activeRole)?.label || "পণ্য"} খুঁজুন`}
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-10 text-gray-700 shadow-sm focus:outline-green-500"
              />
              <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              {search && (
                <RxCross1
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-red-400"
                />
              )}
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setSortOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-sm cursor-pointer"
              >
                <span>সাজান: {SORT_OPTIONS.find((item) => item.value === sortOption)?.label || sortOption}</span>
                <FaSort className="text-gray-500" />
              </button>
              {sortOpen && (
                <div className="absolute right-0 z-40 mt-2 w-full rounded-lg border border-gray-300 bg-white shadow-lg">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSortOption(option.value);
                        setSortOpen(false);
                      }}
                      className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-white p-4 shadow-md">
        <div className="flex flex-wrap gap-3">
          {ROLE_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveRole(tab.key)}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                activeRole === tab.key
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-800 hover:bg-gray-200"
              } cursor-pointer`}
            >
              {tab.label} ({roleCounts[tab.key] || 0})
            </button>
          ))}
        </div>
      </div>

      <div
        className={`grid transition-all duration-300 ease-out ${
          shouldShowStatusTabs
            ? "mt-5 grid-rows-[1fr] opacity-100"
            : "mt-0 grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-wrap gap-3 rounded-lg bg-white p-4 shadow-md">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveStatus(tab.key)}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                  activeStatus === tab.key
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-800 hover:bg-gray-200"
                } cursor-pointer`}
              >
                {tab.label} ({statusCounts[tab.key] || 0})
              </button>
            ))}
          </div>
        </div>
      </div>


      {loading ? (
        <div className="mt-6">
          <TableSkeleton />
        </div>
      ) : error ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-red-600">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>{error}</span>
            <button
              type="button"
              onClick={loadProducts}
              className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm hover:bg-red-50 cursor-pointer"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        </div>
      ) : paginatedItems.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            label={
              shouldShowStatusTabs
                ? activeStatus === "all"
                  ? activeRole
                  : `${activeStatus} ${activeRole}`
                : activeRole
            }
          />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
          <div className="hidden grid-cols-[56px_80px_minmax(220px,1.4fr)_1fr_120px_120px_120px_180px] gap-3 border-b border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 lg:grid">
            <p>নং</p>
            <p>ছবি</p>
            <p>নাম</p>
            <p>মালিক</p>
            <p>পরিমাণ</p>
            <p>দাম</p>
            <p>স্ট্যাটাস</p>
            <p>অ্যাকশন</p>
          </div>

          {paginatedItems.map((product, index) => (
            <div
              key={product._id}
              className="border-t border-gray-200 px-4 py-4 first:border-t-0 lg:grid lg:grid-cols-[56px_80px_minmax(220px,1.4fr)_1fr_120px_120px_120px_180px] lg:items-center lg:gap-3"
            >
              <div className="hidden text-sm text-gray-600 lg:block">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </div>

              <div className="hidden lg:block">
                <img
                  src={product.safeImage}
                  alt={product.safeName}
                  className="h-14 w-14 rounded-lg border border-gray-200 object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3 lg:block">
                  <div className="flex min-w-0 gap-3 lg:hidden">
                    <img
                      src={product.safeImage}
                      alt={product.safeName}
                      className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
                    />
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-base font-semibold text-gray-800">
                        {product.safeName}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">{product.safeCategory}</p>
                      <p className="mt-1 text-sm font-semibold text-green-700">
                        {formatMoney(product.safePrice)}
                      </p>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <p className="line-clamp-2 text-sm font-semibold text-gray-800">
                      {product.safeName}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">{product.safeCategory}</p>
                    <p className="mt-1 text-xs text-gray-500">{formatDate(product.updatedAt || product.createdAt)}</p>
                  </div>

                  <div className="relative lg:hidden" ref={openDropdownId === product._id ? dropdownRef : null}>
                    <button
                      type="button"
                      onClick={() => setOpenDropdownId(openDropdownId === product._id ? null : product._id)}
                     className="cursor-pointer">
                      <BsThreeDotsVertical className="cursor-pointer text-gray-500" />
                    </button>
                    {openDropdownId === product._id && (
                      <div className="absolute right-0 top-8 z-40 w-40 rounded-lg border border-gray-300 bg-white shadow-lg">
                        <button
                          type="button"
                          onClick={() => handleOpenDetails(product._id)}
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 cursor-pointer"
                        >
                          বিস্তারিত
                        </button>
                        {product.safeStatus !== "approved" && (
                          <button
                            type="button"
                            onClick={() => handleApprove(product._id)}
                            className="block w-full px-3 py-2 text-left text-sm text-green-700 hover:bg-gray-100 cursor-pointer"
                          >
                            অনুমোদন
                          </button>
                        )}
                        {product.safeStatus !== "rejected" && (
                          <button
                            type="button"
                            onClick={() => requestRejectConfirmation(product)}
                            className="block w-full px-3 py-2 text-left text-sm text-red-700 hover:bg-gray-100 cursor-pointer"
                          >
                            বাতিল
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-3 text-sm lg:hidden">
                  <div>
                    <p className="text-xs text-gray-500">মালিক</p>
                    <p className="mt-1 font-medium text-gray-700">{product.ownerInfo?.name || "অজানা"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">পরিমাণ</p>
                    <p className="mt-1 font-medium text-gray-700">{product.safeQuantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <div className="mt-1">
                      <StatusBadge status={product.safeStatus} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">আপডেট</p>
                    <p className="mt-1 font-medium text-gray-700">{formatDate(product.updatedAt || product.createdAt)}</p>
                  </div>
                </div>

                {product.safeStatus === "pending" && (
                  <div className="mt-3 lg:hidden">
                    <InlineActionButtons
                      product={product}
                      onApprove={handleApprove}
                      onReject={() => requestRejectConfirmation(product)}
                      actionLoading={actionLoadingId}
                    />
                  </div>
                )}
              </div>

              <div className="hidden text-sm text-gray-700 lg:block">
                <p className="font-semibold">{product.ownerInfo?.name || "অজানা"}</p>
                <p className="mt-1 text-xs text-gray-500">{product.ownerInfo?.phone || "ফোন নেই"}</p>
                <p className="mt-1 text-xs text-gray-500">{product.ownerInfo?.email || "ইমেইল নেই"}</p>
              </div>

              <div className="hidden text-sm font-medium text-gray-700 lg:block">{product.safeQuantity}</div>
              <div className="hidden text-sm font-semibold text-green-700 lg:block">{formatMoney(product.safePrice)}</div>
              <div className="hidden lg:block">
                <StatusBadge status={product.safeStatus} />
              </div>

              <div className="hidden items-center justify-between gap-3 lg:flex">
                <InlineActionButtons
                  product={product}
                  onApprove={handleApprove}
                  onReject={() => requestRejectConfirmation(product)}
                  actionLoading={actionLoadingId}
                />

                <div
                  className="relative ml-auto"
                  ref={openDropdownId === product._id ? dropdownRef : null}
                >
                  <button
                    type="button"
                    onClick={() => setOpenDropdownId(openDropdownId === product._id ? null : product._id)}
                   className="cursor-pointer">
                    <BsThreeDotsVertical className="cursor-pointer text-gray-500" />
                  </button>
                  {openDropdownId === product._id && (
                    <div className="absolute right-0 top-8 z-40 w-44 rounded-lg border border-gray-300 bg-white shadow-lg">
                      <button
                        type="button"
                        onClick={() => handleOpenDetails(product._id)}
                        className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 cursor-pointer"
                      >
                      বিস্তারিত
                      </button>
                      {product.safeStatus !== "approved" && (
                        <button
                          type="button"
                          onClick={() => handleApprove(product._id)}
                          className="block w-full px-3 py-2 text-left text-sm text-green-700 hover:bg-gray-100 cursor-pointer"
                        >
                          অনুমোদন
                        </button>
                      )}
                      {product.safeStatus !== "rejected" && (
                        <button
                          type="button"
                          onClick={() => requestRejectConfirmation(product)}
                          className="block w-full px-3 py-2 text-left text-sm text-red-700 hover:bg-gray-100 cursor-pointer"
                        >
                          বাতিল
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-700">
          <button
            type="button"
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={currentPage === 1 ? "cursor-not-allowed text-gray-400" : "font-semibold cursor-pointer"}
          >
            পূর্ববর্তী
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`rounded-md px-3 py-1.5 text-xs ${
                  currentPage === page
                    ? "bg-green-600 text-white"
                    : "border border-gray-300 bg-white text-gray-700"
                } cursor-pointer`}
              >
                {page < 10 ? `0${page}` : page}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={currentPage === totalPages ? "cursor-not-allowed text-gray-400" : "font-semibold cursor-pointer"}
          >
            পরবর্তী
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;

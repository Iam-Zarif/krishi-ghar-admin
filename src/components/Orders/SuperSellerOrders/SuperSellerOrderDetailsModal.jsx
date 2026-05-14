import {
  formatDate,
  formatMoney,
  getProductImage,
  getProductNames,
  getQuantityLabel,
  normalizeStatus,
  statusClassName,
} from "./supersellerOrderHelpers";

const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 text-sm">
    <span className="font-semibold text-gray-500">{label}</span>
    <span className="max-w-[70%] text-right text-gray-800">{value || "N/A"}</span>
  </div>
);

const SuperSellerOrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const buyer = order.userId || {};
  const status = normalizeStatus(order);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Supersaler Order Details
            </h3>
            <p className="mt-1 text-xs text-gray-500">{order.orderId || order._id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center">
            <img
              src={getProductImage(order.items)}
              alt={getProductNames(order.items)}
              className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800">
                {getProductNames(order.items)}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Quantity: {getQuantityLabel(order.items)}
              </p>
              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClassName(status)}`}
              >
                {status}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <DetailRow label="Supersaler" value={buyer.name} />
            <DetailRow label="Phone" value={buyer.phone} />
            <DetailRow
              label="Location"
              value={[buyer.district, buyer.thana].filter(Boolean).join(", ")}
            />
            <DetailRow label="Role" value={buyer.role} />
            <DetailRow
              label="Total"
              value={formatMoney(order.totalAmount || order.subtotal)}
            />
            <DetailRow label="Order date" value={formatDate(order.createdAt)} />
            <DetailRow label="Order ID" value={order._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperSellerOrderDetailsModal;

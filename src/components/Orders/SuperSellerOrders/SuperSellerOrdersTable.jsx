import { BsThreeDotsVertical } from "react-icons/bs";
import {
  formatMoney,
  getProductImage,
  getProductNames,
  normalizeStatus,
  STATUS_OPTIONS,
  statusClassName,
} from "./supersellerOrderHelpers";

const SuperSellerOrdersTable = ({
  currentPage,
  menuRef,
  onMenuToggle,
  onOpenDetails,
  onStatusUpdate,
  openMenuId,
  orders,
  rowsPerPage,
  updatingId,
}) => (
  <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow-md">
    <table className="w-full min-w-[1100px]">
      <thead>
        <tr className="bg-gray-200 text-left text-sm text-gray-700">
          <th className="p-3">Sn.</th>
          <th className="p-3">Supersaler</th>
          <th className="p-3">Product</th>
          <th className="p-3">Amount</th>
          <th className="p-3">Status</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order, index) => {
          const buyer = order?.userId || {};
          const status = normalizeStatus(order);
          const isUpdating = updatingId === order._id;

          return (
            <tr
              key={order._id}
              className="border-y border-gray-200 transition hover:bg-gray-50"
            >
              <td className="p-3 text-sm text-gray-600">
                {(currentPage - 1) * rowsPerPage + index + 1}
              </td>
              <td className="p-3 text-sm text-gray-700">
                <p className="font-semibold">{buyer.name || "Unknown"}</p>
                <p className="text-xs text-gray-500">
                  {buyer.phone || "No phone"}
                </p>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <img
                    src={getProductImage(order.items)}
                    alt={getProductNames(order.items)}
                    className="h-12 w-12 rounded-lg border border-gray-200 object-cover"
                  />
                  <p className="max-w-xs text-sm font-medium text-gray-800">
                    {getProductNames(order.items)}
                  </p>
                </div>
              </td>
              <td className="p-3 text-sm font-semibold text-green-700">
                {formatMoney(order.totalAmount || order.subtotal)}
              </td>
              <td className="p-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClassName(status)}`}
                >
                  {status}
                </span>
              </td>
              <td className="p-3">
                <div
                  className="relative inline-flex justify-center"
                  ref={openMenuId === order._id ? menuRef : null}
                >
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => onMenuToggle(order._id)}
                    className="cursor-pointer rounded-full p-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <BsThreeDotsVertical />
                  </button>

                  {openMenuId === order._id && (
                    <div className="absolute right-0 top-9 z-30 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                      <button
                        type="button"
                        onClick={() => onOpenDetails(order)}
                        className="block w-full cursor-pointer px-4 py-2.5 text-left text-sm hover:bg-gray-100"
                      >
                        View details
                      </button>
                      <div className="h-px bg-gray-100" />
                      {STATUS_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          disabled={isUpdating || status === option.value}
                          onClick={() => onStatusUpdate(order, option.value)}
                          className="block w-full cursor-pointer px-4 py-2.5 text-left text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default SuperSellerOrdersTable;

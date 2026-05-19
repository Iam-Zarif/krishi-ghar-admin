import { BsThreeDotsVertical } from "react-icons/bs";
import {
  formatMoney,
  normalizeStatus,
  productOwner,
  resolveProductImage,
  statusClassName,
} from "./supersellerOrderHelpers";

const SuperSellerOrdersTable = ({
  actionLoadingId,
  currentPage,
  menuRef,
  onApprove,
  onMenuToggle,
  onOpenDetails,
  onReject,
  openMenuId,
  products,
  rowsPerPage,
}) => (
  <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow-md">
    <table className="w-full min-w-[1000px]">
      <thead>
        <tr className="bg-gray-200 text-left text-sm text-gray-700">
          <th className="p-3">Sn.</th>
          <th className="p-3">Supersaler</th>
          <th className="p-3">Product</th>
          <th className="p-3">Price</th>
          <th className="p-3">Status</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        {products.map((product, index) => {
          const owner = productOwner(product);
          const status = normalizeStatus(product);
          const isUpdating = actionLoadingId === product._id;

          return (
            <tr
              key={product._id}
              className="border-y border-gray-200 transition hover:bg-gray-50"
            >
              <td className="p-3 text-sm text-gray-600">
                {(currentPage - 1) * rowsPerPage + index + 1}
              </td>
              <td className="p-3 text-sm text-gray-700">
                <p className="font-semibold">{owner.name || "Unknown"}</p>
                <p className="text-xs text-gray-500">
                  {owner.phone || "No phone"}
                </p>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <img
                    src={resolveProductImage(product.image)}
                    alt={product.productName || "Product"}
                    className="h-12 w-12 rounded-lg border border-gray-200 object-cover"
                  />
                  <div>
                    <p className="max-w-xs text-sm font-medium text-gray-800">
                      {product.productName || "Unnamed product"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.quantity || 0} {product.unit || "unit"}
                    </p>
                  </div>
                </div>
              </td>
              <td className="p-3 text-sm font-semibold text-green-700">
                {formatMoney(product.price)}
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
                  ref={openMenuId === product._id ? menuRef : null}
                >
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => onMenuToggle(product._id)}
                    className="cursor-pointer rounded-full p-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <BsThreeDotsVertical />
                  </button>

                  {openMenuId === product._id && (
                    <div className="absolute right-0 top-9 z-30 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                      <button
                        type="button"
                        onClick={() => onOpenDetails(product)}
                        className="block w-full cursor-pointer px-4 py-2.5 text-left text-sm hover:bg-gray-100"
                      >
                        View details
                      </button>
                      <div className="h-px bg-gray-100" />
                      <button
                        type="button"
                        disabled={isUpdating || status === "approved"}
                        onClick={() => onApprove(product)}
                        className="block w-full cursor-pointer px-4 py-2.5 text-left text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={isUpdating || status === "rejected"}
                        onClick={() => onReject(product)}
                        className="block w-full cursor-pointer px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                      >
                        Reject
                      </button>
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

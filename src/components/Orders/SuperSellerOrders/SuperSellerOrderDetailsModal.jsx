import {
  formatDate,
  formatMoney,
  normalizeStatus,
  productOwner,
  resolveProductImage,
  statusClassName,
} from "./supersellerOrderHelpers";

const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 text-sm">
    <span className="font-semibold text-gray-500">{label}</span>
    <span className="max-w-[70%] text-right text-gray-800">{value || "N/A"}</span>
  </div>
);

const SuperSellerOrderDetailsModal = ({ product, onClose }) => {
  if (!product) return null;

  const owner = productOwner(product);
  const status = normalizeStatus(product);
  const category =
    product?.category?.name ||
    product?.categoryName ||
    (typeof product?.category === "string" ? product.category : "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Supersaler Product Details
            </h3>
            <p className="mt-1 text-xs text-gray-500">{product._id}</p>
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
              src={resolveProductImage(product.image)}
              alt={product.productName || "Product"}
              className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800">
                {product.productName || "Unnamed product"}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Quantity: {product.quantity || 0} {product.unit || "unit"}
              </p>
              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClassName(status)}`}
              >
                {status}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <DetailRow label="Supersaler" value={owner.name} />
            <DetailRow label="Phone" value={owner.phone} />
            <DetailRow
              label="Location"
              value={[owner.district, owner.thana].filter(Boolean).join(", ")}
            />
            <DetailRow label="Category" value={category} />
            <DetailRow label="Price" value={formatMoney(product.price)} />
            <DetailRow label="Add to sell post" value={product.addToSellPost} />
            <DetailRow label="Created" value={formatDate(product.createdAt)} />
            <DetailRow label="Approved at" value={formatDate(product.approvedAt)} />
            <DetailRow label="Product ID" value={product._id} />
          </div>

          {product.description ? (
            <div className="mt-5">
              <p className="text-sm font-semibold text-gray-500">Description</p>
              <p className="mt-2 max-h-40 overflow-y-auto rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                {product.description}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SuperSellerOrderDetailsModal;

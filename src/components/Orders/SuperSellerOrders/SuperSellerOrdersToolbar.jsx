import { BsSearch } from "react-icons/bs";
import { FaRegSmile } from "react-icons/fa";
import { SORT_OPTIONS } from "./supersellerOrderHelpers";

const SuperSellerOrdersToolbar = ({
  count,
  loading,
  onRefresh,
  search,
  onSearchChange,
  sortOption,
  onSortChange,
}) => (
  <div className="rounded-lg bg-white px-6 py-5 shadow-md">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center text-lg font-semibold text-gray-700">
        <FaRegSmile className="mr-2 text-green-500" />
        Super Seller Orders
        <span className="ml-3 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-500">
          {count}
        </span>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-green-500 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "লোড হচ্ছে..." : "রিফ্রেশ"}
      </button>
    </div>

    <div className="mt-5 flex flex-col gap-3 lg:flex-row">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search by order, supersaler, product, location, status..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        className="w-full cursor-text rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 shadow-sm focus:outline-green-500"
        />
        <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      <select
        value={sortOption}
        onChange={(event) => onSortChange(event.target.value)}
        className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm focus:outline-green-500 lg:w-44"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default SuperSellerOrdersToolbar;

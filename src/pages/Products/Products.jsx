import { useEffect, useState, useRef } from "react";
import { BsSearch, BsThreeDotsVertical } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { FaSort } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Api } from "../../Api/Api";
import { useNavigate } from "react-router-dom";

const Products = () => {
 const navigate = useNavigate();
 const token = localStorage.getItem("token");
 const [products, setProducts] = useState([]);
 const [search, setSearch] = useState("");
 const [sortOpen, setSortOpen] = useState(false);
 const [sortOption, setSortOption] = useState("Sort By");
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [currentPage, setCurrentPage] = useState(1);
   const [deleteId, setDeleteId] = useState(null);
   const [deleteloading, setDeleteloading] = useState(false);
 const [openDropdownId, setOpenDropdownId] = useState(null);
 const dropdownRef = useRef(null);
 const itemsPerPage = 10;

 useEffect(() => {
   const fetchProducts = async () => {
     try {
       const res = await axios.get(`${Api}/api/v1/admin/all-products`, {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       });
       setProducts(res.data.products || []);
       setLoading(false);
     } catch (err) {
       setError(err);
       toast.error(err);
       setLoading(false);
     }
   };
   fetchProducts();
 }, [token]);

 const handleSort = (type) => {
   const sorted = [...products];
   switch (type) {
     case "A-Z":
       sorted.sort((a, b) => a.productName.localeCompare(b.productName));
       break;
     case "Z-A":
       sorted.sort((a, b) => b.productName.localeCompare(a.productName));
       break;
     case "Price Low-High":
       sorted.sort((a, b) => a.price - b.price);
       break;
     case "Price High-Low":
       sorted.sort((a, b) => b.price - a.price);
       break;
     case "Oldest-Newest":
       sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
       break;
     case "Newest-Oldest":
       sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
       break;
     default:
       return;
   }
   setProducts(sorted);
   setSortOption(type);
   setSortOpen(false);
 };

 useEffect(() => {
   const handleClickOutside = (e) => {
     if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
       setSortOpen(false);
       setOpenDropdownId(null);
     }
   };
   document.addEventListener("mousedown", handleClickOutside);
   return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 const formatDate = (dateStr) => {
   return new Date(dateStr).toLocaleString("en-GB", {
     day: "numeric",
     month: "short",
     year: "numeric",
     hour: "2-digit",
     minute: "2-digit",
   });
 };

 const filtered = products.filter((p) =>
   p.productName?.toLowerCase().includes(search.toLowerCase())
 );

 const totalPages = Math.ceil(filtered.length / itemsPerPage);
 const paginatedItems = filtered.slice(
   (currentPage - 1) * itemsPerPage,
   currentPage * itemsPerPage
 );

 const handlePreviousPage = () => {
   if (currentPage > 1) setCurrentPage(currentPage - 1);
 };

 const handleNextPage = () => {
   if (currentPage < totalPages) setCurrentPage(currentPage + 1);
 };


 
  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleteloading(true);
    try {
      await axios.delete(`${Api}/api/v1/admin/all-products/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter((p) => p._id !== deleteId));
      toast.success("Product deleted");
    } catch (err) {
      toast.error(err);
    }
    setDeleteloading(false);
    setDeleteId(null);
  };
 const handleView = (id) => {
   navigate(`/product/${id}`);
 };

  const askDelete = (id) => {
    setDeleteId(id);
    setOpenDropdownId(null);
  };

  console.log(products)
  return (
    <div className="p-6 w-full text-gray-800">
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative">
            <button
              onClick={() => setDeleteId(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <RxCross1 className="w-5 h-5 cursor-pointer" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
              Are you sure you want to delete product with ID:
              <span className="font-medium text-red-500"> {deleteId}</span>?
            </p>
            <p className="text-gray-600 mt-1 text-sm">
              This action cannot be undone.
            </p>
            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-gray-700 border rounded-lg cursor-pointer hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
              >
                {deleteloading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-700">Products</h1>
        <p className="bg-white text-sm rounded-2xl px-3 py-1 border border-gray-300 text-gray-600">
          Total: {filtered.length}
        </p>
      </div>

      <div className="grid grid-cols-12 gap-3 w-full items-center">
        <div className="relative mb-4 col-span-10">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full py-3 pr-4 pl-9 focus:outline-green-600 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700"
          />
          <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          {search && (
            <RxCross1
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 cursor-pointer"
            />
          )}
        </div>
        <div className="relative mb-4 col-span-2 w-full">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="border border-gray-300 w-full px-4 py-3 rounded-lg bg-white flex justify-between cursor-pointer items-center gap-2 text-gray-700"
          >
            {sortOption} <FaSort />
          </button>
          {sortOpen && (
            <div
              ref={dropdownRef}
              className="absolute z-50 bg-white border border-gray-200 mt-2 rounded-md shadow-lg w-60 text-gray-700"
            >
              {[
                "A-Z",
                "Z-A",
                "Price Low-High",
                "Price High-Low",
                "Oldest-Newest",
                "Newest-Oldest",
              ].map((type) => (
                <div
                  key={type}
                  onClick={() => handleSort(type)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  {type}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-center py-8 text-gray-600">Loading products...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-8">
          {error?.response?.data?.message ||
            error.message ||
            "Something went wrong"}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border bg-gray-50 border-gray-300 rounded-lg text-sm text-gray-700">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">SN</th>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-center">Qty + Unit</th>
                <th className="p-3 text-center">Category</th>
                <th className="p-3">For Sell?</th>
                <th className="p-3 text-center">Options</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems?.map((p, i) => (
                <tr
                  key={p._id}
                  className="border-t border-gray-200 hover:bg-gray-100 relative"
                >
                  <td className="p-3">
                    {(currentPage - 1) * itemsPerPage + i + 1}
                  </td>
                  <td className="p-3">
                    <img
                      src={p?.image}
                      alt={p.productName}
                      className="w-14 h-14 object-cover rounded-md border border-gray-200"
                    />
                  </td>
                  <td className="p-3 font-medium max-w-xs truncate">
                    {p.productName}
                  </td>
                  <td className="p-3">
                    {formatDate(p.updatedAt || p.createdAt)}
                  </td>
                  <td className="p-3 text-center">
                    {p.quantity} {p.unit || "unit"}
                  </td>
                  <td className="p-3 text-center">{p.category || "—"}</td>
                  <td className="p-3">
                    {p.addToSellPost ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md">
                        Yes
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-red-700 px-2 py-1 rounded-md">
                        No
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center relative">
                    <BsThreeDotsVertical
                      onClick={() =>
                        setOpenDropdownId(
                          openDropdownId === p._id ? null : p._id
                        )
                      }
                      className="mx-auto text-gray-500 cursor-pointer"
                    />
                    {openDropdownId === p._id && (
                      <div className="absolute top-14 right-5 bg-gray-100 border border-gray-300 shadow-lg rounded-md w-48 z-[99999] text-sm">
                        <div className="absolute -top-1.5 right-9">
                          <div className="absolute -top-[2px] right-0 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-300"></div>
                          <div className="absolute top-0 right-0 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
                        </div>
                        <ul className="list-none p-2">
                          <li
                            onClick={() => handleView(p._id)}
                            className="cursor-pointer hover:bg-white p-2 rounded-md"
                          >
                            View Product
                          </li>
                          <li className="cursor-pointer hover:bg-white p-2 rounded-md">
                            Send Message
                          </li>
                          <li
                            className="cursor-pointer text-red-600 hover:bg-white p-2 rounded-md"
                            onClick={() => askDelete(p._id)}
                          >
                            Delete Product
                          </li>
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-center items-center gap-4 text-sm text-gray-700">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`font-semibold ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`px-3 py-1.5 cursor-pointer rounded-md text-xs ${
                      currentPage === num
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-700 border border-gray-300"
                    }`}
                  >
                    {num < 10 ? `0${num}` : num}
                  </button>
                )
              )}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`font-semibold ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;

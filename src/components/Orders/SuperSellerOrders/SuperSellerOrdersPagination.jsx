const SuperSellerOrdersPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-700">
      <button
        type="button"
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={
          currentPage === 1
            ? "cursor-not-allowed text-gray-400"
            : "cursor-pointer font-semibold"
        }
      >
        Previous
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`rounded-md px-2 py-1.5 text-xs ${
                currentPage === page
                  ? "cursor-pointer bg-green-600 text-white"
                  : "cursor-pointer border border-gray-300 bg-white"
              }`}
            >
              {page < 10 ? `0${page}` : page}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className={
          currentPage === totalPages
            ? "cursor-not-allowed text-gray-400"
            : "cursor-pointer font-semibold"
        }
      >
        Next
      </button>
    </div>
  );
};

export default SuperSellerOrdersPagination;

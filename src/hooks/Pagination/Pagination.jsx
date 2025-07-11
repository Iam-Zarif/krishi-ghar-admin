// eslint-disable-next-line react/prop-types
const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center mt-12 w-full items-center gap-5">
      <p
        className={`font-bold cursor-pointer ${
          currentPage === 1 ? "text-gray-400 cursor-not-allowed" : ""
        }`}
        onClick={handlePreviousPage}
      >
        Previous
      </p>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, index) => (
          <p
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`rounded-md px-2 py-1.5 text-xs cursor-pointer ${
              currentPage === index + 1 ? "bg-green-600 text-white" : ""
            }`}
          >
            {index + 1 < 10 ? `0${index + 1}` : index + 1}
          </p>
        ))}
      </div>

      <p
        className={`font-bold cursor-pointer ${
          currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : ""
        }`}
        onClick={handleNextPage}
      >
        Next
      </p>
    </div>
  );
};

export default Pagination;

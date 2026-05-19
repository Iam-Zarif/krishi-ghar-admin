export const getPageStartIndex = (currentPage = 1, rowsPerPage = 10) =>
  (Math.max(1, Number(currentPage) || 1) - 1) * (Number(rowsPerPage) || 10);

export const getSerialNumber = ({ currentPage, rowsPerPage, index }) =>
  getPageStartIndex(currentPage, rowsPerPage) + index + 1;

export const paginateRows = (rows = [], currentPage = 1, rowsPerPage = 10) => {
  const startIndex = getPageStartIndex(currentPage, rowsPerPage);
  return rows.slice(startIndex, startIndex + rowsPerPage);
};

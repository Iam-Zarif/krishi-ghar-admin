
import ReportsTable from "../../hooks/ReportsTable/ReportsTable";

const Reports = () => {
  const reportsData = Array.from({ length: 20 }, (_, index) => ({
    sn: `${index + 1}`,
    reportID: `#R234${index + 100}`,
    reportName: `Abdullah Monayem`,
    profilePhoto:
      "https://plus.unsplash.com/premium_photo-1689539137236-b68e436248de?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D", // Sample profile photo URL
    issue: "Issue Description",
    date: `01/${((index + 1) % 12) + 1}/2024`,
    totalSales: `${(index + 1) * 1000} TK`,
    status: index % 2 === 0 ? "Completed" : "Pending",
    userType:
      index % 4 === 0
        ? "consumer"
        : index % 4 === 1
        ? "superSeller"
        : index % 4 === 2
        ? "producer"
        : "wholesaler", // Assigning userType to each report
  }));

  return (
    <div>
      <div className="flex items-center justify-between px-4">
        <div className="text-lg font-semibold text-gray-700 flex items-center">
         <p className="text-3xl text-green-600">Reports</p>
        </div>
      </div>
      <ReportsTable data={reportsData} />
    </div>
  );
};

export default Reports;

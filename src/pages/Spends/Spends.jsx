import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Spends = () => {
  const initialData = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
    datasets: [
      {
        label: "Spends (TK)",
        data: [3000, 4000, 5000, 7000, 8000, 9000, 10000],
        borderColor: "#FF5733",
        backgroundColor: "rgba(255, 87, 51, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const [marketingData, setMarketingData] = useState(initialData);
  const [operationData, setOperationData] = useState(initialData);
  const [staffData, setStaffData] = useState(initialData);
  const [totalSpendsData, setTotalSpendsData] = useState(initialData);

  // Function to simulate real-time daily data change for the different spend categories
  const updateSpendsData = () => {
    const newMarketingData = [...marketingData.datasets[0].data];
    const newOperationData = [...operationData.datasets[0].data];
    const newStaffData = [...staffData.datasets[0].data];
    const newTotalSpendsData = [...totalSpendsData.datasets[0].data];

    // Simulate daily spends by adding random values to each dataset
    const newMarketingSpends =
      newMarketingData[newMarketingData.length - 1] +
      Math.floor(Math.random() * 500);
    const newOperationSpends =
      newOperationData[newOperationData.length - 1] +
      Math.floor(Math.random() * 300);
    const newStaffSpends =
      newStaffData[newStaffData.length - 1] + Math.floor(Math.random() * 200);

    // Slide the data to the left, replacing the old day's data with the new day's data
    newMarketingData.shift();
    newMarketingData.push(newMarketingSpends);
    newOperationData.shift();
    newOperationData.push(newOperationSpends);
    newStaffData.shift();
    newStaffData.push(newStaffSpends);

    // Calculate the new total spends (sum of the three categories for the day)
    const totalDailySpends =
      newMarketingSpends + newOperationSpends + newStaffSpends;
    newTotalSpendsData.shift();
    newTotalSpendsData.push(totalDailySpends);

    // Update the data state
    setMarketingData({
      ...marketingData,
      datasets: [
        {
          ...marketingData.datasets[0],
          data: newMarketingData,
        },
      ],
    });

    setOperationData({
      ...operationData,
      datasets: [
        {
          ...operationData.datasets[0],
          data: newOperationData,
        },
      ],
    });

    setStaffData({
      ...staffData,
      datasets: [
        {
          ...staffData.datasets[0],
          data: newStaffData,
        },
      ],
    });

    setTotalSpendsData({
      ...totalSpendsData,
      datasets: [
        {
          ...totalSpendsData.datasets[0],
          data: newTotalSpendsData,
        },
      ],
    });
  };

  // Update the spends data every 3 seconds for smoother effect (simulate daily data)
  useEffect(() => {
    const interval = setInterval(updateSpendsData, 3000); // Every 3 seconds for smoother updates
    return () => clearInterval(interval); // Clean up on unmount
  }, [marketingData, operationData, staffData, totalSpendsData]);

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Spends Overview",
        font: { size: 18 },
      },
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Days",
        },
      },
      y: {
        title: {
          display: true,
          text: "Spends (TK)",
        },
        ticks: {
          beginAtZero: true,
          stepSize: 1000,
        },
      },
    },
  };

  return (
    <>
      <div className="px-6 py-6 bg-white w-full shadow-md rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Spends on Marketing */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-700">
              Tpday Spends
            </h3>
            <div className="h-[300px] sm:h-[400px]">
              <Line data={marketingData} options={options} />
            </div>
          </div>

          {/* Spends on Operations */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-700">
              This Month Spends
            </h3>
            <div className="h-[300px] sm:h-[400px]">
              <Line data={operationData} options={options} />
            </div>
          </div>

          {/* Spends on Staff */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-700">
              This Year Spends
            </h3>
            <div className="h-[300px] sm:h-[400px]">
              <Line data={staffData} options={options} />
            </div>
          </div>

          {/* Total Spends */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Spends
            </h3>
            <div className="h-[300px] sm:h-[400px]">
              <Line data={totalSpendsData} options={options} />
            </div>
          </div>
        </div>

      
      </div>
      <div className="px-6 mt-6 py-6 bg-white w-full shadow-md rounded-lg">
        <h2 className="text-xl font-bold text-gray-800 mt-6">2024</h2>
        <table className="w-full mt-4 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Month</th>
              <th className="border border-gray-300 px-4 py-2">Consumer</th>
              <th className="border border-gray-300 px-4 py-2">Super Seller</th>
              <th className="border border-gray-300 px-4 py-2">Wholesaler</th>
              <th className="border border-gray-300 px-4 py-2">Producer</th>
              <th className="border border-gray-300 px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-center">
                January
              </td>
              <td className="border border-gray-300 px-4 text-center py-2">
                5000
              </td>
              <td className="border border-gray-300 px-4 text-center py-2">
                6000
              </td>
              <td className="border border-gray-300 px-4 text-center py-2">
                7000
              </td>
              <td className="border border-gray-300 px-4 text-center py-2">
                8000
              </td>
              <td className="border border-gray-300 px-4 text-center py-2">
                26000
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-center">
                February
              </td>
              <td className="border border-gray-300 px-4 text-center py-2">
                5000
              </td>
              <td className="border border-gray-300 px-4 text-center py-2">
                6000
              </td>
              <td className="border border-gray-300 px-4 text-center py-2">
                7000
              </td>
              <td className="border border-gray-300 px-4 text-center py-2">
                8000
              </td>
              <td className="border border-gray-300 px-4 text-center py-2">
                26000
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-center">
                March
              </td>
              <td className="border border-gray-300 px-4 text-center py-2">
                5000
              </td>
              <td className="border border-gray-300 px-4 text-center py-2">
                6000
              </td>
              <td className="border border-gray-300 px-4 text-center py-2">
                7000
              </td>
              <td className="border border-gray-300 px-4 text-center py-2">
                8000
              </td>
              <td className="border border-gray-300 px-4 text-center py-2">
                26000
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-center">
                April
              </td>
              <td className="border border-gray-300 px-4 text-center py-2">
                5000
              </td>
              <td className="border border-gray-300 px-4 text-center py-2">
                6000
              </td>
              <td className="border border-gray-300 px-4 text-center py-2">
                7000
              </td>
              <td className="border border-gray-300 px-4 text-center py-2">
                8000
              </td>
              <td className="border border-gray-300 px-4 text-center py-2">
                26000
              </td>
            </tr>
          </tbody>
        </table>
        <button className="ml-auto mt-3 block text-right px-3 rounded-lg bg-yellow-500 text-white text-sm py-1.5">
          Download PDF
        </button>
      </div>
    </>
  );
};

export default Spends;

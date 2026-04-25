import  { useState, useEffect } from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Earnings = () => {
  const initialData = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
    datasets: [
      {
        label: "Earnings (TK)",
        data: [5000, 6000, 8000, 9500, 10000, 12000, 13000],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const [producerData, setProducerData] = useState(initialData);
  const [superSellerData, setSuperSellerData] = useState(initialData);
  const [wholesalerData, setWholesalerData] = useState(initialData);
  const [totalEarningsData, setTotalEarningsData] = useState(initialData);

  const updateEarningsData = () => {
    const newProducerData = [...producerData.datasets[0].data];
    const newSuperSellerData = [...superSellerData.datasets[0].data];
    const newWholesalerData = [...wholesalerData.datasets[0].data];
    const newTotalEarningsData = [...totalEarningsData.datasets[0].data];

    const newProducerEarnings =
      newProducerData[newProducerData.length - 1] +
      Math.floor(Math.random() * 500);
    const newSuperSellerEarnings =
      newSuperSellerData[newSuperSellerData.length - 1] +
      Math.floor(Math.random() * 400);
    const newWholesalerEarnings =
      newWholesalerData[newWholesalerData.length - 1] +
      Math.floor(Math.random() * 300);

    newProducerData.shift();
    newProducerData.push(newProducerEarnings);
    newSuperSellerData.shift();
    newSuperSellerData.push(newSuperSellerEarnings);
    newWholesalerData.shift();
    newWholesalerData.push(newWholesalerEarnings);

    const totalDailyEarnings =
      newProducerEarnings + newSuperSellerEarnings + newWholesalerEarnings;
    newTotalEarningsData.shift();
    newTotalEarningsData.push(totalDailyEarnings);

    setProducerData({
      ...producerData,
      datasets: [
        {
          ...producerData.datasets[0],
          data: newProducerData,
        },
      ],
    });

    setSuperSellerData({
      ...superSellerData,
      datasets: [
        {
          ...superSellerData.datasets[0],
          data: newSuperSellerData,
        },
      ],
    });

    setWholesalerData({
      ...wholesalerData,
      datasets: [
        {
          ...wholesalerData.datasets[0],
          data: newWholesalerData,
        },
      ],
    });

    setTotalEarningsData({
      ...totalEarningsData,
      datasets: [
        {
          ...totalEarningsData.datasets[0],
          data: newTotalEarningsData,
        },
      ],
    });
  };

  useEffect(() => {
    const interval = setInterval(updateEarningsData, 3000); 
    return () => clearInterval(interval); 
  }, [producerData, superSellerData, wholesalerData, totalEarningsData,]);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Earnings Overview",
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
          text: "Earnings (TK)",
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
        <div className="grid  mt-6 grid-cols-1 sm:grid-cols-2 gap-6 ">
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-700">
              Earnings From Producers
            </h3>
            <div className="h-[300px] sm:h-[400px]">
              <Line data={producerData} options={options} />
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-700">
              Earnings From Super Sellers
            </h3>
            <div className="h-[300px] sm:h-[400px]">
              <Line data={superSellerData} options={options} />
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-700">
              Earnings From Whole Sellers
            </h3>
            <div className="h-[300px] sm:h-[400px]">
              <Line data={wholesalerData} options={options} />
            </div>
          </div>
          <div className="">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Earnings (Month)
            </h3>
            <div className="h-[300px] sm:h-[400px]">
              <Line data={totalEarningsData} options={options} />
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
                <th className="border border-gray-300 px-4 py-2">
                  Super Seller
                </th>
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
            <button className="ml-auto mt-3 block text-right px-3 rounded-lg bg-green-500 text-white text-sm py-1.5 cursor-pointer">Download PDF</button>
        </div>
    </>
  );
};

export default Earnings;

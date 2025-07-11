import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  FaUsers,
  FaShoppingCart,
  FaStore,
  FaTruck,
  FaUserTie,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const earningsSpendsData = [
  { name: "Day 1", Earnings: 1000, Spends: 500 },
  { name: "Day 2", Earnings: 1200, Spends: 600 },
  { name: "Day 3", Earnings: 1100, Spends: 550 },
  { name: "Day 4", Earnings: 1300, Spends: 700 },
  { name: "Day 5", Earnings: 1400, Spends: 800 },
  { name: "Day 6", Earnings: 1600, Spends: 850 },
  { name: "Day 7", Earnings: 1500, Spends: 750 },
  { name: "Day 8", Earnings: 1700, Spends: 900 },
  { name: "Day 9", Earnings: 1800, Spends: 950 },
  { name: "Day 10", Earnings: 1900, Spends: 1000 },
  { name: "Day 11", Earnings: 2100, Spends: 1100 },
  { name: "Day 12", Earnings: 1600, Spends: 1200 },
];

const sellerGrowthData = [
  { name: "Month 1", Sellers: 500 },
  { name: "Month 2", Sellers: 520 },
  { name: "Month 3", Sellers: 550 },
  { name: "Month 4", Sellers: 570 },
  { name: "Month 5", Sellers: 590 },
  { name: "Month 6", Sellers: 610 },
  { name: "Month 7", Sellers: 640 },
  { name: "Month 8", Sellers: 670 },
  { name: "Month 9", Sellers: 700 },
  { name: "Month 10", Sellers: 740 },
  { name: "Month 11", Sellers: 770 },
  { name: "Month 12", Sellers: 800 },
];

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [countLoading, setCountLoading] = useState(true);
  const [todayUsers, setTodayUsers] = useState(0);
  const [approvedUsers, setApprovedUsers] = useState(0);
  const [pendingUsers, setPendingUsers] = useState(0);
  const [roleCounts, setRoleCounts] = useState({
    consumer: 0,
    supersaler: 0,
    wholesaler: 0,
    producer: 0,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    setCountLoading(true);
    axios
      .get(
        "https://ecommerce-client-backend-1.onrender.com/api/v1/admin/users",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      )
      .then((response) => {
        const users = response.data?.users || [];

        const filteredUsers = users.filter((user) => user.role !== "admin");

        setTotalUsers(filteredUsers.length);

        const today = new Date().toISOString().split("T")[0];
        let todayCount = 0;
        let pendingCount = 0;
        let approvedCount = 0;

        const roleCounts = {
          producer: { pending: 0, approved: 0 },
          supersaler: { pending: 0, approved: 0 },
          wholesaler: { pending: 0, approved: 0 },
          consumer: { pending: 0, approved: 0 },
        };

        filteredUsers.forEach(({ createdAt, status, role }) => {
          const createdAtStr = createdAt?.split("T")[0];
          if (createdAtStr === today) todayCount++;
          if (status === "pending") pendingCount++;
          if (status === "approved") approvedCount++;
          if (roleCounts[role]) {
            roleCounts[role][status]++;
          }
        });

        setTodayUsers(todayCount);
        setPendingUsers(pendingCount);
        setApprovedUsers(approvedCount);
        setRoleCounts(roleCounts);
        setCountLoading(false);
      })
      .catch((error) => {
        setCountLoading(false);
        console.error("Error fetching data:", error);
      });
  }, [token]);

  const stats = [
    {
      label: "Total Users",
      total: totalUsers,
      today: todayUsers,
      approved: approvedUsers,
      pending: pendingUsers,
      icon: <FaUsers className="text-blue-600 text-3xl" />,
    },
    {
      label: "Consumers",
      total: roleCounts.consumer.pending + roleCounts.consumer.approved,
      today: roleCounts.consumer.pending + roleCounts.consumer.approved,
      pending: roleCounts.consumer.pending,
      approved: roleCounts.consumer.approved,
      icon: <FaShoppingCart className="text-green-600 text-3xl" />,
      route: "/dashboard/consumers",
    },
    {
      label: "Super Sellers",
      total: roleCounts.supersaler.pending + roleCounts.supersaler.approved,
      today: roleCounts.supersaler.pending + roleCounts.supersaler.approved,
      pending: roleCounts.supersaler.pending,
      approved: roleCounts.supersaler.approved,
      icon: <FaStore className="text-yellow-600 text-3xl" />,
      route: "/dashboard/super-sellers",
    },
    {
      label: "Wholesalers",
      total: roleCounts.wholesaler.pending + roleCounts.wholesaler.approved,
      today: roleCounts.wholesaler.pending + roleCounts.wholesaler.approved,
      pending: roleCounts.wholesaler.pending,
      approved: roleCounts.wholesaler.approved,
      icon: <FaTruck className="text-red-600 text-3xl" />,
      route: "/dashboard/wholesalers",
    },
    {
      label: "Producers",
      total: roleCounts.producer.pending + roleCounts.producer.approved,
      today: roleCounts.producer.pending + roleCounts.producer.approved,
      pending: roleCounts.producer.pending,
      approved: roleCounts.producer.approved,
      icon: <FaUserTie className="text-purple-600 text-3xl" />,
      route: "/dashboard/producers",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {countLoading ? (
          <>
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className=" w-full rounded-xl h-[10rem] bg-gray-500 animate-pulse"
              ></div>
            ))}
          </>
        ) : (
          
          <>
            {stats?.map(
              ({ label, total, today, pending, approved, icon, route }) => (
                <Link
                  key={label}
                  to={route}
                  className="block px-6 py-10 bg-gray-50 shadow-lg justify-center gap-10 rounded-xl flex items-center space-x-4 hover:scale-105 transform transition-all duration-300"
                >
                  <div>
                    <p className="text-lg font-bold text-gray-800">
                      {label} : {total}
                    </p>
                    <div className="p-4 w-10 h-10 mx-auto text-center">
                      {icon}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Today: {today}</p>
                    <p className="text-sm text-red-500">Pending: {pending}</p>
                    <p className="text-sm text-green-500">
                      Approved: {approved}
                    </p>
                  </div>
                </Link>
              )
            )}
          </>
        )}
      </div>

      <div className="mt-8 p-6 bg-white shadow rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Earnings vs Spends</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={earningsSpendsData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="name" tick={{ fill: "#4A5568", fontSize: 14 }} />
            <YAxis tick={{ fill: "#4A5568", fontSize: 14 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 14, fontWeight: "bold" }} />
            <Bar
              dataKey="Earnings"
              fill="#4CAF50"
              radius={[10, 10, 0, 0]}
              barSize={30}
            />
            <Bar
              dataKey="Spends"
              fill="#FF5733"
              radius={[10, 10, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-8 p-6 bg-white shadow rounded-lg">
        <h3 className="text-xl font-semibold mb-4">
          Sellers Growth Over the Last 12 Months
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={sellerGrowthData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="name" tick={{ fill: "#4A5568", fontSize: 14 }} />
            <YAxis tick={{ fill: "#4A5568", fontSize: 14 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 14, fontWeight: "bold" }} />
            <Line
              type="monotone"
              dataKey="Sellers"
              stroke="#007bff"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;

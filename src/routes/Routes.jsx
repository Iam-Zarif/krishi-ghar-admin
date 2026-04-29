import {
  createBrowserRouter,
  generatePath,
  Navigate,
  useParams,
} from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/Home/Home";
import Login from "../pages/auth/Login/Login";
import Dashboard from "../components/Dashboard/Dashboard";
import Consumers from "../components/Consumers/Consumers";
import Producers from "../components/Producers/Producers";
import SupperSellers from "../components/SupperSellers/SupperSellers";
import WholeSalers from "../components/WholeSalers/WholeSalers";
import ConsumerOrders from "../components/Orders/ConsumerOrders/ConsumerOrders";
import WholesalerOrders from "../components/Orders/WholesalerOrders/WholesalerOrders";
import SuperSellerOrders from "../components/Orders/SuperSellerOrders/SuperSellerOrders";
import Earnings from "../pages/Earnings/Earnings";
import Spends from "../pages/Spends/Spends";
import Reports from "../pages/Reports/Reports";
import Settings from "../pages/Settings/Settings";
import ConsumerPage from "../pages/dynamic/ConsumerPage/ConsumerPage";
import SuperSellerPage from "../pages/dynamic/SuperSellerPage/SuperSellerPage";
import WholeSellersPage from "../pages/dynamic/WholeSellersPage/WholeSellersPage";
import ProducerPage from "../pages/dynamic/ProducerPage/ProducerPage";
import OrderPage from "../pages/dynamic/OrderPage/OrderPage";
import ReportPage from "../pages/dynamic/ReportPage/ReportPage";
import PrivateRoute from "../Context/GetProfile/PrivateRoute";
import { Api } from "../Api/Api";
import Products from "../pages/Products/Products";

const legacyDashboardRedirects = [
  ["/dashboard", "/"],
  ["/dashboard/dashboard", "/"],
  ["/dashboard/consumers", "/consumers"],
  ["/dashboard/Consumers", "/consumers"],
  ["/dashboard/consumers/:id", "/consumers/:id"],
  ["/dashboard/Consumers/:id", "/consumers/:id"],
  ["/dashboard/producers", "/producers"],
  ["/dashboard/Producers", "/producers"],
  ["/dashboard/producers/:id", "/producers/:id"],
  ["/dashboard/Producers/:id", "/producers/:id"],
  ["/dashboard/super-sellers", "/super-sellers"],
  ["/dashboard/Super-Sellers", "/super-sellers"],
  ["/dashboard/supersellers", "/super-sellers"],
  ["/dashboard/super-sellers/:id", "/super-sellers/:id"],
  ["/dashboard/Super-Sellers/:id", "/super-sellers/:id"],
  ["/dashboard/supersellers/:id", "/super-sellers/:id"],
  ["/dashboard/wholesalers", "/wholesalers"],
  ["/dashboard/WholeSalers", "/wholesalers"],
  ["/dashboard/WholeSellers", "/wholesalers"],
  ["/dashboard/wholesalers/:id", "/wholesalers/:id"],
  ["/dashboard/WholeSalers/:id", "/wholesalers/:id"],
  ["/dashboard/WholeSellers/:id", "/wholesalers/:id"],
  ["/dashboard/orders/consumer", "/orders/consumer"],
  ["/dashboard/orders/consumer/:id", "/orders/consumer/:id"],
  ["/dashboard/orders/wholesaler", "/orders/wholesaler"],
  ["/dashboard/orders/superseller", "/orders/superseller"],
  ["/dashboard/Earnings", "/earnings"],
  ["/dashboard/Spends", "/spends"],
  ["/dashboard/Reports", "/reports"],
  ["/dashboard/Reports/:id", "/reports/:id"],
  ["/dashboard/settings", "/settings"],
  ["/dashboard/products", "/products"],
];

const LegacyRedirect = ({ to }) => {
  const params = useParams();
  return <Navigate to={generatePath(to, params)} replace />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "consumers",
            element: (
              <PrivateRoute>
                <Consumers />
              </PrivateRoute>
            ),
          },
          {
            path: "consumers/:id",
            element: <ConsumerPage />,
            loader: ({ params }) =>
              fetch(`${Api}/api/v1/admin/all-consumer/${params.id}`, {
                credentials: "include",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }),
          },
          {
            path: "producers",
            element: <Producers />,
          },
          {
            path: "producers/:id",
            element: <ProducerPage />,
            loader: ({ params }) =>
              fetch(`${Api}/api/v1/admin/all-producer/${params.id}`, {
                credentials: "include",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }),
          },
          {
            path: "super-sellers",
            element: <SupperSellers />,
          },
          {
            path: "super-sellers/:id",
            element: <SuperSellerPage />,
          },
          {
            path: "wholesalers",
            element: <WholeSalers />,
          },
          {
            path: "wholesalers/:id",
            element: <WholeSellersPage />,
          },
          {
            path: "orders/consumer",
            element: <ConsumerOrders />,
          },
          {
            path: "orders/consumer/:id",
            element: <OrderPage />,
          },
          {
            path: "orders/wholesaler",
            element: <WholesalerOrders />,
          },
          {
            path: "orders/superseller",
            element: <SuperSellerOrders />,
          },
          {
            path: "earnings",
            element: <Earnings />,
          },
          {
            path: "spends",
            element: <Spends />,
          },
          {
            path: "reports",
            element: <Reports />,
          },
          {
            path: "reports/:id",
            element: <ReportPage />,
          },
          { path: "settings", element: <Settings /> },
          { path: "products", element: <Products /> },
        ],
      },
      ...legacyDashboardRedirects.map(([from, to]) => ({
        path: from,
        element: <LegacyRedirect to={to} />,
      })),
      {
        path: "/auth/login",
        element: <Login />,
      },
    ],
  },
]);

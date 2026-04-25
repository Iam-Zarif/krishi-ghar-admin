import { createBrowserRouter } from "react-router-dom";
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
import DashboardRouteResolver from "../components/DashboardRouteResolver/DashboardRouteResolver";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <DashboardRouteResolver />,
          },
          {
            path: "/dashboard/dashboard",
            element: (
              <PrivateRoute>
                {" "}
                <Dashboard />
              </PrivateRoute>
            ),
          },
          {
            path: "/dashboard/Consumers",
            element: <Consumers />,
          },
          {
            path: "/dashboard/Consumers/:id",
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
            path: "/dashboard/producers",
            element: <Producers />,
          },
          {
            path: "/dashboard/Producers/:id",
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
            path: "/dashboard/Super-Sellers",
            element: <SupperSellers />,
          },
          {
            path: "/dashboard/Super-Sellers/:id",
            element: <SuperSellerPage />,
          },
          {
            path: "/dashboard/WholeSalers",
            element: <WholeSalers />,
          },
          {
            path: "/dashboard/WholeSalers/:id",
            element: <WholeSellersPage />,
          },
          {
            path: "/dashboard/orders/consumer",
            element: <ConsumerOrders />,
          },
          {
            path: "/dashboard/orders/consumer/:id",
            element: <OrderPage />,
          },
          {
            path: "/dashboard/orders/wholesaler",
            element: <WholesalerOrders />,
          },
          {
            path: "/dashboard/orders/superseller",
            element: <SuperSellerOrders />,
          },
          {
            path: "/dashboard/Earnings",
            element: <Earnings />,
          },
          {
            path: "/dashboard/Spends",
            element: <Spends />,
          },
          {
            path: "/dashboard/Reports",
            element: <Reports />,
          },
          {
            path: "/dashboard/Reports/:id",
            element: <ReportPage />,
          },
          { path: "/dashboard/settings", element: <Settings /> },
          {path:"/dashboard/products" , element: <Products/>}
        ],
      },
      {
        path: "/auth/login",
        element: <Login />,
      },
    ],
  },
]);

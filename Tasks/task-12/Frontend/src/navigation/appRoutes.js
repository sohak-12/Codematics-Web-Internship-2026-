import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Landing from "../screens/Landing";
import Authentication from "../screens/Authentication";
import Register from "../screens/Register";
import ResetPassword from "../screens/ResetPassword";
import ItemOverview from "../screens/ItemOverview";
import Basket from "../screens/Basket";
import Checkout from "../screens/Checkout";
import OrderSuccess from "../screens/OrderSuccess";
import MyOrders from "../screens/MyOrders";
import SearchResults from "../screens/SearchResults";
import CategoryItems from "../screens/CategoryItems";
import Dashboard from "../screens/Dashboard";
import DashboardOverview from "../screens/DashboardOverview";
import AccountList from "../screens/AccountList";
import ItemCatalog from "../screens/ItemCatalog";
import CategoryManagement from "../screens/CategoryManagement";
import AdminOrders from "../screens/AdminOrders";
import RevenueAnalytics from "../screens/RevenueAnalytics";

const appRoutes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Landing /> },
      { path: "login", element: <Authentication /> },
      { path: "register", element: <Authentication /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "item/:id", element: <ItemOverview /> },
      { path: "basket", element: <Basket /> },
      { path: "checkout", element: <Checkout /> },
      { path: "order-success", element: <OrderSuccess /> },
      { path: "my-orders", element: <MyOrders /> },
      { path: "search", element: <SearchResults /> },
      { path: "category-items", element: <CategoryItems /> },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          { index: true, element: <DashboardOverview /> },
          { path: "accounts", element: <AccountList /> },
          { path: "catalog", element: <ItemCatalog /> },
          { path: "categories", element: <CategoryManagement /> },
          { path: "orders", element: <AdminOrders /> },
          { path: "analytics", element: <RevenueAnalytics /> },
        ],
      },
    ],
  },
], {
  future: { v7_startTransition: true },
});

export default appRoutes;

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import "./index.css";
import appRoutes from "./navigation/appRoutes";
import { appStore } from "./state/appStore";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={appStore}>
      <RouterProvider router={appRoutes} />
    </Provider>
  </React.StrictMode>
);

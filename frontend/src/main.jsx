import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import CustomThemeProvider from "./app/providers/ThemeProvider";
import router from "./app/router";
import "./app/i18n/index";
import "mapbox-gl/dist/mapbox-gl.css";
import "./styles/toast.css";
import { ToastProvider } from "@/shared/utils/toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CustomThemeProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </CustomThemeProvider>
  </React.StrictMode>,
);

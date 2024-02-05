import React from "react";
import ReactDOM from "react-dom/client";

// import "@/provider/i18n";
import "@/index.css";

import QueryProvider from "@/provider/query";
import RouteProvider from "@/provider/routes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <RouteProvider />
    </QueryProvider>
  </React.StrictMode>
);

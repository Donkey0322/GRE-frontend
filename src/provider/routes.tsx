import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ROUTES from "@/routes";

const router = createBrowserRouter(ROUTES);

export default function RouteProvider() {
  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}

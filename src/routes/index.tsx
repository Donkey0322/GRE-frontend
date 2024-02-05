import { createRoutesFromElements, Route } from "react-router-dom";

const router = createRoutesFromElements(
  <Route
    path="*"
    lazy={async () => {
      const Main = await import("@/app/main");
      return { Component: Main.default };
    }}
  ></Route>
);

export default router;

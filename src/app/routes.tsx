import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import SupervisorPage from "../pages/SupervisorPage";
import App from "./App";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <RegisterPage /> },
      { path: "/supervisor", element: <SupervisorPage /> },
    ],
  },
]);

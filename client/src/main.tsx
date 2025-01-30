import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import App from "./App.tsx";
import Board from "./pages/NewBoard.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import Login from "./pages/Login.tsx";
import Navbar from "./components/Navbar";
import SignUp from "./pages/SignUp.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <div>
            <Navbar />
            <Board />
          </div>
        ),
      },
      {
        path: "/login",
        element: (
          <div>
            <Navbar />
            <Login />
          </div>
        ),
      },
      {
        path: "/signup", // Define the route for the SignUp page
        element: (
          <div>
            <Navbar />
            <SignUp />
          </div>
        ),
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SearchHistory from "./pages/SearchHistory";
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
        path: "/signup",
        element: (
          <div>
            <Navbar />
            <SignUp />
          </div>
        ),
      },
      {
        path: "/search-history", // New Route for Search History Page
        element: (
          <div>
            <Navbar />
            <SearchHistory />
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

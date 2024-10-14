import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../components/Login/Login";
import Logout from "../components/Login/Logout";
import Signup from "../components/Login/Signup";
import QuestionPage from "../components/QuestionPage/QuestionPage";
import AuthRedirect from "./AuthRedirect";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../components/HomePage/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "/questionpage",
            element: <QuestionPage />,
          },
        ],
      }
    ],
  },
  {
    element: <AuthRedirect />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "/logout",
    element: <Logout />,
  },
]);

import { createBrowserRouter } from "react-router";
import HomePage from "../pages/homePage/HomePage";
import ErrorPage from "../components/ErrorPage/ErrorPage";
import RootLayout from "../Layouts/RootLayout";
import SignIn from "../pages/signIn/SignIn";
import Register from "../pages/register/Register";
import ProblemDetails from "../pages/problemDetails/ProblemDetails";
import SubmitIssue from "../pages/submitIssue/SubmitIssue";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage></ErrorPage>,
    element: <RootLayout></RootLayout>,
    children:[
      {
        index: true,
        Component: HomePage
      },
      {
        path:'/signin',
        Component: SignIn
      },
      {
        path:'/register',
        Component: Register
      },
      {
        path: '/problemDetails',
        element: <ProblemDetails></ProblemDetails>
      },
      {
        path: '/submitIssue',
        element: <SubmitIssue></SubmitIssue>
      },
    ]
  },
]);
import { createBrowserRouter } from "react-router";
import HomePage from "../pages/homePage/HomePage";
import ErrorPage from "../components/ErrorPage/ErrorPage";
import RootLayout from "../Layouts/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage></ErrorPage>,
    element: <RootLayout></RootLayout>,
    children:[
      {
        index: true,
        Component: HomePage
      }
    ]
  },
]);
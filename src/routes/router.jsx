import { createBrowserRouter } from "react-router";
import HomePage from "../pages/homePage/HomePage";
import ErrorPage from "../components/ErrorPage/ErrorPage";
import RootLayout from "../Layouts/RootLayout";
import DashboardLayout from "../Layouts/DashboardLayout";
import SignIn from "../pages/signIn/SignIn";
import Register from "../pages/register/Register";
import SubmitIssue from "../pages/submitIssue/SubmitIssue";
import AllIssues from "../pages/allIssues/AllIssues";
import IssueDetails from "../pages/issueDetails/IssueDetails";
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "../components/RoleRoute/RoleRoute";

// Dashboard pages
import DashboardIndex from "../pages/dashboard/DashboardIndex";
import Profile from "../pages/dashboard/Profile";
// Citizen
import CitizenDashboard from "../pages/dashboard/citizen/CitizenDashboard";
import MyIssues from "../pages/dashboard/citizen/MyIssues";
import Subscription from "../pages/dashboard/citizen/Subscription";
// Staff
import StaffDashboard from "../pages/dashboard/staff/StaffDashboard";
// Admin
import AdminDashboard from "../pages/dashboard/admin/AdminDashboard";
import AdminAllIssues from "../pages/dashboard/admin/AdminAllIssues";
import ManageUsers from "../pages/dashboard/admin/ManageUsers";
import ManageStaff from "../pages/dashboard/admin/ManageStaff";
import AdminPayments from "../pages/dashboard/admin/AdminPayments";
import PaymentSuccess from "../pages/payment/PaymentSuccess";
import PaymentCancel from "../pages/payment/PaymentCancel";
import ContactPage from "../pages/contactUs/ContactPage";
import AboutPage from "../pages/aboutUs/AboutPage";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <RootLayout />,
    children: [
      { index: true, Component: HomePage },
      { path: "/signin", Component: SignIn },
      { path: "/register", Component: Register },
      { path: "/all-issues", Component: AllIssues },
      {
        path: "/issues/:id",
        element: <IssueDetails />,
      },
      {
        path: "/submitIssue",
        element: <PrivateRoute><SubmitIssue /></PrivateRoute>,
      },
      {
        path: "/payment/success",
        element: <PrivateRoute><PaymentSuccess /></PrivateRoute>,
      },
      { path: "/payment/cancel", Component: PaymentCancel },
      { path: "/contactUs", Component: ContactPage },
      { path: "/aboutUs", Component: AboutPage },
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      // Index — auto-redirects by role
      { index: true, element: <DashboardIndex /> },

      // Citizen routes
      {
        path: "citizen",
        element: <RoleRoute roles={["citizen"]}><CitizenDashboard /></RoleRoute>,
      },
      { path: "my-issues", element: <MyIssues /> },
      { path: "subscription", element: <Subscription /> },

      // Staff routes
      {
        path: "staff",
        element: <RoleRoute roles={["staff"]}><StaffDashboard /></RoleRoute>,
      },
      {
        path: "assigned-issues",
        element: <RoleRoute roles={["staff", "admin"]}><StaffDashboard /></RoleRoute>,
      },

      // Admin routes
      {
        path: "admin",
        element: <RoleRoute roles={["admin"]}><AdminDashboard /></RoleRoute>,
      },
      {
        path: "all-issues-admin",
        element: <RoleRoute roles={["admin"]}><AdminAllIssues /></RoleRoute>,
      },
      {
        path: "manage-users",
        element: <RoleRoute roles={["admin"]}><ManageUsers /></RoleRoute>,
      },
      {
        path: "manage-staff",
        element: <RoleRoute roles={["admin"]}><ManageStaff /></RoleRoute>,
      },
      {
        path: "payments",
        element: <RoleRoute roles={["admin"]}><AdminPayments /></RoleRoute>,
      },

      // Shared
      { path: "profile", element: <Profile /> },
    ],
  },
]);

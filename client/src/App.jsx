import React, { useEffect } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Jobs from "./pages/Jobs";
import BrowseJobs from "./pages/BrowseJobs";
import JobDescription from "./pages/JobDescription";
import Companies from "./admin/Companies";
import CreateNewJob from "./admin/CreateNewCompany";
import CompanySetup from "./admin/CompanySetup";
import CompanyDetails from "./admin/CompanyDetails";
import AdminJobs from "./admin/AdminJobs";
import PostJob from "./admin/PostJob";
import Applicants from "./admin/Applicants";
import { useSelector } from "react-redux";
import ErrorPage from "./pages/ErrorPage";
import ReportIssue from "./pages/ReportIssue";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
const Layout = () => {
  return (
    <div className="min-h-screen text-gray-900 dark:text-white">
      <ScrollToTop/>
      <Navbar />
      <ResumeAnalyzer />
      <div className="px-6 lg:px-20">
        <Outlet />
      </div>
    </div>
  );
};

const RestrictedAdminRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const isRecruiter = user?.role === "recruiter";
  return isRecruiter ? children : <Navigate to="/home" replace />;
};
const RestrictedUserRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const isStudent = !user || user?.role === "student";
  return isStudent ? children : <Navigate to="/admin/companies" replace />;
};
const RestrictedAuthRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const isAuthenticated = user ? true : false;
  return isAuthenticated ? (
    user?.role === "student" ? (
      <Navigate to="/home" replace />
    ) : (
      <Navigate to="/admin/companies" replace />
    )
  ) : (
    children
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: (
          <RestrictedUserRoute>
            <Home />
          </RestrictedUserRoute>
        ),
      },
      {
        path: "/home",
        element: (
          <RestrictedUserRoute>
            <Home />
          </RestrictedUserRoute>
        ),
      },
      {
        path: "/report/issue",
        element: <ReportIssue />,
      },
      {
        path: "/login",
        element: (
          <RestrictedAuthRoute>
            <Login />
          </RestrictedAuthRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <RestrictedAuthRoute>
            <Signup />
          </RestrictedAuthRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <RestrictedUserRoute>
            <Profile />
          </RestrictedUserRoute>
        ),
      },
      {
        path: "/description/:jobId",
        element: (
          <RestrictedUserRoute>
            <JobDescription />
          </RestrictedUserRoute>
        ),
      },
      {
        path: "/jobs",
        element: (
          <RestrictedUserRoute>
            <Jobs />
          </RestrictedUserRoute>
        ),
      },
      {
        path: "/browse",
        element: (
          <RestrictedUserRoute>
            <BrowseJobs />
          </RestrictedUserRoute>
        ),
      },
      {
        path: "/admin/companies",
        element: (
          <RestrictedAdminRoute>
            <Companies />
          </RestrictedAdminRoute>
        ),
      },
      {
        path: "/admin/companies/create",
        element: (
          <RestrictedAdminRoute>
            <CreateNewJob />
          </RestrictedAdminRoute>
        ),
      },
      {
        path: "/admin/companies/:companyId",
        element: (
          <RestrictedAdminRoute>
            <CompanySetup />
          </RestrictedAdminRoute>
        ),
      },
      {
        path: "/admin/companies/:companyId/details",
        element: (
          <RestrictedAdminRoute>
            <CompanyDetails />
          </RestrictedAdminRoute>
        ),
      },
      {
        path: "/admin/jobs",
        element: (
          <RestrictedAdminRoute>
            <AdminJobs />
          </RestrictedAdminRoute>
        ),
      },
      {
        path: "/admin/jobs/create",
        element: (
          <RestrictedAdminRoute>
            <PostJob />
          </RestrictedAdminRoute>
        ),
      },
      {
        path: "/admin/jobs/:id/applicants",
        element: (
          <RestrictedAdminRoute>
            <Applicants />
          </RestrictedAdminRoute>
        ),
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;

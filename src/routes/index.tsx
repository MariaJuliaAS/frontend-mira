import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "../pages/dashboard";
import { Calendar } from "../pages/calendar";
import { Courses } from "../pages/courses";
import { Timers } from "../pages/timers";
import { Goals } from "../pages/goals";
import { Login } from "../pages/login";
import { Register } from "../pages/register";
import { Layout } from "../components/layout";
import { PrivateRoutes } from "./privateRoutes";

export const router = createBrowserRouter([
    {
        element: <Login />,
        path: "/login"
    },
    {
        element: <Register />,
        path: "/register"
    },
    {
        element: <Layout />,
        children: [
            {
                element:
                    <PrivateRoutes>
                        <Dashboard />
                    </PrivateRoutes>,
                path: "/"
            },
            {
                element:
                    <PrivateRoutes>
                        <Calendar />
                    </PrivateRoutes>,
                path: "/calendar"
            },
            {
                element:
                    <PrivateRoutes>
                        <Courses />
                    </PrivateRoutes>,
                path: "/courses"
            },
            {
                element:
                    <PrivateRoutes>
                        <Timers />
                    </PrivateRoutes>,
                path: "/timers"
            },
            {
                element:
                    <PrivateRoutes>
                        <Goals />
                    </PrivateRoutes>,
                path: "/goals"
            },
        ]
    }
])
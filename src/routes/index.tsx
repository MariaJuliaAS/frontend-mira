import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "../pages/dashboard";
import { Calendar } from "../pages/calendar";
import { Courses } from "../pages/courses";
import { Timers } from "../pages/timers";
import { Goals } from "../pages/goals";
import { Login } from "../pages/login";
import { Register } from "../pages/register";


export const router = createBrowserRouter([
    {
        element: <Dashboard />,
        path: "/"
    },
    {
        element: <Calendar />,
        path: "/calendar"
    },
    {
        element: <Courses />,
        path: "/courses"
    },
    {
        element: <Timers />,
        path: "/timers"
    },
    {
        element: <Goals />,
        path: "/goals"
    },
    {
        element: <Login />,
        path: "/login"
    },
    {
        element: <Register />,
        path: "/register"
    }
])
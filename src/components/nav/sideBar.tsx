import { LuGraduationCap, LuClock, LuBookOpen, LuTarget, LuCalendar, LuLayoutDashboard, LuUser } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function SideBar() {
    const navigate = useNavigate();
    const [currentNav, setCurrentNav] = useState("");

    function logOut() {
        localStorage.removeItem("@tokenMira");
        navigate("/login", { replace: true });
    }

    return (
        <div className="bg-white min-h-screen w-60 border-r border-gray-200 flex flex-col">
            <header className="border-b border-gray-200 w-full p-5 flex flex-col items-center">
                <p className="flex flex-row items-center font-bold sm:text-2xl text-xl">
                    <LuGraduationCap className="text-blue-950 mr-2 sm:text-4xl text-3xl" />
                    mira
                </p>
                <span className="sm:text-sm text-xs text-zinc-500">Asistente acadêmico</span>
            </header>

            <nav className="p-5 flex flex-col gap-4 flex-12">
                <Link to="/" onClick={() => setCurrentNav("dashboard")} className={`group flex flex-row gap-2 items-center rounded-xl w-full font-medium px-4 py-2 cursor-pointer hover:scale-105 transition-all transform  ${currentNav == "dashboard" ? "bg-blue-950 text-white" : "bg-transparent text-zinc-700 hover:bg-blue-800 hover:text-white"}`}>
                    <LuLayoutDashboard size={20} className={`transition-all transform ${currentNav === "dashboard" ? "text-white" : "text-zinc-700 group-hover:text-white"}`} />
                    Dashboard
                </Link>
                <Link to="/courses" onClick={() => setCurrentNav("courses")} className={`group flex flex-row gap-2 items-center rounded-xl w-full font-medium px-4 py-2 cursor-pointer hover:scale-105 transition-all transform  ${currentNav == "courses" ? "bg-blue-950 text-white" : "bg-transparent text-zinc-700 hover:bg-blue-800 hover:text-white"}`}>
                    <LuBookOpen size={20} className={`transition-all transform ${currentNav === "courses" ? "text-white" : "text-zinc-700 group-hover:text-white"}`} />
                    Matérias
                </Link>
                <Link to="/calendar" onClick={() => setCurrentNav("calendar")} className={`group flex flex-row gap-2 items-center rounded-xl w-full font-medium px-4 py-2 cursor-pointer hover:scale-105 transition-all transform  ${currentNav == "calendar" ? "bg-blue-950 text-white" : "bg-transparent text-zinc-700 hover:bg-blue-800 hover:text-white"}`}>
                    <LuCalendar size={20} className={`transition-all transform ${currentNav === "calendar" ? "text-white" : "text-zinc-700 group-hover:text-white"}`} />
                    Calendário
                </Link>
                <Link to="/timers" onClick={() => setCurrentNav("timers")} className={`group flex flex-row gap-2 items-center rounded-xl w-full font-medium px-4 py-2 cursor-pointer hover:scale-105 transition-all transform  ${currentNav == "timers" ? "bg-blue-950 text-white" : "bg-transparent text-zinc-700 hover:bg-blue-800 hover:text-white"}`}>
                    <LuClock size={20} className={`transition-all transform ${currentNav === "timers" ? "text-white" : "text-zinc-700 group-hover:text-white"}`} />
                    Cronômetro
                </Link>
                <Link to="/goals" onClick={() => setCurrentNav("goals")} className={`group flex flex-row gap-2 items-center rounded-xl w-full font-medium px-4 py-2 cursor-pointer hover:scale-105 transition-all transform  ${currentNav == "goals" ? "bg-blue-950 text-white" : "bg-transparent text-zinc-700 hover:bg-blue-800 hover:text-white"}`}>
                    <LuTarget size={20} className={`transition-all transform ${currentNav === "goals" ? "text-white" : "text-zinc-700 group-hover:text-white"}`} />
                    Metas
                </Link>
                <Link to="/profile" onClick={() => setCurrentNav("profile")} className={`group flex flex-row gap-2 items-center rounded-xl w-full font-medium px-4 py-2 cursor-pointer hover:scale-105 transition-all transform  ${currentNav == "profile" ? "bg-blue-950 text-white" : "bg-transparent text-zinc-700 hover:bg-blue-800 hover:text-white"}`}>
                    <LuUser size={20} className={`transition-all transform ${currentNav === "profile" ? "text-white" : "text-zinc-700 group-hover:text-white"}`} />
                    Perfil
                </Link>
            </nav>

            <footer className="px-4 py-2 flex-1 flex">
                <button onClick={logOut} className="group flex flex-row gap-2 items-center rounded-xl w-full font-medium h-10 px-4 cursor-pointer hover:scale-105 transition-all transform text-zinc-700 hover:text-white hover:bg-red-600">
                    <MdLogout size={20} className={`transition-all transform ${currentNav === "productivity" ? "text-white" : "text-zinc-700 group-hover:text-white"}`} />
                    Sair da conta
                </button>
            </footer>
        </div>
    )
}
import { useState } from "react";
import { LuGraduationCap } from "react-icons/lu";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { SideBar } from "./sideBar";


export function Header() {
    const [toggleSidebar, setToggleSidebar] = useState(false);
    return (
        <>
            <header className="bg-white border-b border-gray-200 h-14 flex flex-row justify-between items-center px-5">
                <button
                    onClick={() => setToggleSidebar(true)}
                    className="hover:scale-105 transform transition-all cursor-pointer">
                    <TbLayoutSidebarLeftExpand size={26} color="#000" />
                </button>
                <p className="flex flex-row items-center font-bold sm:text-2xl text-xl">
                    <LuGraduationCap className="text-blue-950 mr-2 sm:text-4xl text-3xl" />
                    mira
                </p>
            </header>

            {toggleSidebar && (
                <div
                    className="fixed inset-0 bg-gray-900/80 z-40"
                    onClick={() => setToggleSidebar(false)}
                />
            )}
            <div className={`fixed top-0 left-0 w-60 h-full z-50 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ${toggleSidebar ? "translate-x-0" : "-translate-x-full"}`}>
                <SideBar />
            </div>
        </>
    )
}
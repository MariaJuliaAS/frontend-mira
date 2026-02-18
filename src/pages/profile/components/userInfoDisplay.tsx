import { FaRegBuilding } from "react-icons/fa";
import { LuBookOpen, LuCalendar } from "react-icons/lu";
import type { UserDetailProps } from "../types/profileTypes";

interface UserInfoDisplayProps {
    user?: UserDetailProps;
}

export function UserInfoDisplay({ user }: UserInfoDisplayProps) {
    return (
        <>
            <div className="bg-zinc-300/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-3 sm:py-4 flex items-start sm:items-center gap-3">
                <LuBookOpen size={18} className="sm:w-5 sm:h-5 text-zinc-800 shrink-0 mt-0.5 sm:mt-0" />
                <p className="flex flex-col text-xs sm:text-sm">
                    <span className="font-medium text-gray-600">Curso</span>
                    {user?.profiles?.program ? (
                        <span className="font-semibold text-gray-900">{user?.profiles?.program}</span>
                    ) : (
                        <span className="text-zinc-500 text-xs">Clique em adicionar seu curso.</span>
                    )}
                </p>
            </div>

            <div className="bg-zinc-300/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-3 sm:py-4 flex items-start sm:items-center gap-3">
                <LuCalendar size={18} className="sm:w-5 sm:h-5 text-zinc-800 shrink-0 mt-0.5 sm:mt-0" />
                <p className="flex flex-col text-xs sm:text-sm">
                    <span className="font-medium text-gray-600">Período</span>
                    {user?.profiles?.period ? (
                        <span className="font-semibold text-gray-900">{user?.profiles?.period}° Período</span>
                    ) : (
                        <span className="text-zinc-500 text-xs">Clique em adicionar seu período.</span>
                    )}
                </p>
            </div>

            <div className="bg-zinc-300/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-3 sm:py-4 flex items-start sm:items-center gap-3">
                <FaRegBuilding size={18} className="sm:w-5 sm:h-5 text-zinc-800 shrink-0 mt-0.5 sm:mt-0" />
                <p className="flex flex-col text-xs sm:text-sm">
                    <span className="font-medium text-gray-600">Universidade</span>
                    {user?.profiles?.university ? (
                        <span className="font-semibold text-gray-900">{user?.profiles?.university}</span>
                    ) : (
                        <span className="text-zinc-500 text-xs">Clique em adicionar sua universidade.</span>
                    )}
                </p>
            </div>
        </>
    );
}

import { LuClock, LuBookOpen, LuTarget } from "react-icons/lu";
import type { UserStatsProps } from "../types/profileTypes";

interface UserStatsDisplayProps {
    stats?: UserStatsProps;
    secondsToHours: (seconds: number | undefined) => string;
}

export function UserStatsDisplay({ stats, secondsToHours }: UserStatsDisplayProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col gap-3 sm:gap-4 h-full">
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-2xl p-3 sm:p-4 shadow-lg flex flex-col items-center justify-center">
                <span className="flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-blue-100 text-blue-600 font-semibold shrink-0">
                    <LuClock size={18} className="sm:w-6 sm:h-6 text-blue-950" />
                </span>
                <p className="font-bold text-lg sm:text-xl mt-2">{secondsToHours(stats?.totalStudyTime.time)}</p>
                <span className="text-zinc-500 text-xs sm:text-sm text-center">Horas estudadas</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-2xl p-3 sm:p-4 shadow-lg flex flex-col items-center justify-center">
                <span className="flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-blue-100 text-blue-600 font-semibold shrink-0">
                    <LuBookOpen size={18} className="sm:w-6 sm:h-6 text-blue-950" />
                </span>
                <p className="font-bold text-lg sm:text-xl mt-2">{stats?.activeCourses}</p>
                <span className="text-zinc-500 text-xs sm:text-sm text-center">Matérias ativas</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-2xl p-3 sm:p-4 shadow-lg flex flex-col items-center justify-center">
                <span className="flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-blue-100 text-blue-600 font-semibold shrink-0">
                    <LuTarget size={18} className="sm:w-6 sm:h-6 text-blue-950" />
                </span>
                <p className="font-bold text-lg sm:text-xl mt-2">{stats?.activeGoals}</p>
                <span className="text-zinc-500 text-xs sm:text-sm text-center">Metas ativas</span>
            </div>
        </div>
    );
}

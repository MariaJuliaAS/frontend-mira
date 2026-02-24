import { LuClock, LuTarget, LuBookOpen } from "react-icons/lu";
import type { UserStatsProps } from "../../profile/types/profileTypes";

interface StatsCardsProps {
    stats?: UserStatsProps;
}

export function StatsCards({ stats }: StatsCardsProps) {
    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours === 0) {
            return `${mins}min`;
        } else if (mins === 0) {
            return `${hours}h`;
        }
        return `${hours}h ${mins}min`;
    };

    const statsData = [
        {
            icon: LuClock,
            label: "Tempo de Estudo",
            value: stats?.totalStudyTime?.time ? formatTime(stats.totalStudyTime.time) : "0min",
            color: "bg-purple-50",
            iconColor: "text-purple-600",
            borderColor: "border-purple-200"
        },
        {
            icon: LuTarget,
            label: "Metas Ativas",
            value: stats?.activeGoals || 0,
            color: "bg-green-50",
            iconColor: "text-green-600",
            borderColor: "border-green-200"
        },
        {
            icon: LuBookOpen,
            label: "Cursos Ativos",
            value: stats?.activeCourses || 0,
            color: "bg-blue-50",
            iconColor: "text-blue-600",
            borderColor: "border-blue-200"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {statsData.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={index}
                        className={`bg-white border ${stat.borderColor} rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg transition-all duration-300 hover:scale-105`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`${stat.color} p-3 rounded-xl`}>
                                <Icon size={20} className={stat.iconColor} />
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

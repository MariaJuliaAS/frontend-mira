import { LuTarget, LuClock } from "react-icons/lu";
import { BsExclamationCircle } from "react-icons/bs";
import { format, differenceInDays, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { GoalsProps } from "../../goals/types/goalsTypes";
import { Link } from "react-router-dom";

interface UpcomingGoalsProps {
    goals: GoalsProps[];
}

export function UpcomingGoals({ goals }: UpcomingGoalsProps) {
    const getUrgencyLevel = (endDate: string) => {
        const daysUntil = differenceInDays(new Date(endDate), new Date());

        if (isPast(new Date(endDate)) && daysUntil < 0) {
            return { level: "overdue", label: "Atrasada", color: "bg-red-50 border-red-200", textColor: "text-red-600", icon: BsExclamationCircle };
        } else if (daysUntil <= 3) {
            return { level: "urgent", label: `${daysUntil} dia(s)`, color: "bg-orange-50 border-orange-200", textColor: "text-orange-600", icon: BsExclamationCircle };
        } else if (daysUntil <= 7) {
            return { level: "soon", label: `${daysUntil} dias`, color: "bg-yellow-50 border-yellow-200", textColor: "text-yellow-600", icon: LuClock };
        } else if (daysUntil <= 14) {
            return { level: "medium", label: `${daysUntil} dias`, color: "bg-blue-50 border-blue-200", textColor: "text-blue-600", icon: LuClock };
        }
        return null;
    };

    const upcomingGoals = goals
        .map(goal => ({
            ...goal,
            urgency: getUrgencyLevel(goal.end_date)
        }))
        .filter(goal => goal.urgency !== null);

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-xl">
                        <LuTarget size={20} className="text-blue-950" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg sm:text-xl text-gray-900">Metas Próximas</h2>
                        <p className="text-xs sm:text-sm text-gray-500">Acompanhe suas metas com prazo próximo</p>
                    </div>
                </div>
                <Link
                    to="/goals"
                    className="text-xs sm:text-sm text-blue-950 hover:underline font-medium"
                >
                    Ver todas
                </Link>
            </div>

            {upcomingGoals.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">Nenhuma meta com prazo próximo</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {upcomingGoals.slice(0, 5).map((goal) => {
                        const urgency = goal.urgency!;
                        const Icon = urgency.icon;

                        return (
                            <div
                                key={goal.id}
                                className={`border rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] ${urgency.color}`}
                            >
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                                            {goal.name}
                                        </h3>
                                        {goal.course && (
                                            <p className="text-xs text-gray-600 mt-1 truncate">
                                                {goal.course.name}
                                            </p>
                                        )}
                                    </div>
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${urgency.textColor} bg-white/60 shrink-0`}>
                                        <Icon size={14} />
                                        <span className="text-xs font-semibold">{urgency.label}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-3 text-xs text-gray-600">
                                    <span>Prazo: {format(new Date(goal.end_date), "dd 'de' MMM", { locale: ptBR })}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

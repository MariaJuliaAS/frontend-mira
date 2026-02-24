import { LuCalendar, LuClock } from "react-icons/lu";
import { BsExclamationCircle } from "react-icons/bs";
import { format, differenceInDays, isPast, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { CommitmentsProps } from "../../calendar/types/calendarTypes";
import { COMMITMENT_TYPES } from "../../calendar/constants/commitmentTypes";
import { Link } from "react-router-dom";

interface UpcomingCommitmentsProps {
    commitments: CommitmentsProps[];
}

export function UpcomingCommitments({ commitments }: UpcomingCommitmentsProps) {
    const getDateLabel = (date: Date) => {
        const commitmentDate = new Date(date);
        const daysUntil = differenceInDays(commitmentDate, new Date());

        if (isPast(commitmentDate) && !isToday(commitmentDate)) {
            return { label: "Atrasado", color: "bg-red-50 border-red-200", textColor: "text-red-600", icon: BsExclamationCircle };
        } else if (isToday(commitmentDate)) {
            return { label: "Hoje", color: "bg-orange-50 border-orange-200", textColor: "text-orange-600", icon: BsExclamationCircle };
        } else if (isTomorrow(commitmentDate)) {
            return { label: "Amanhã", color: "bg-yellow-50 border-yellow-200", textColor: "text-yellow-600", icon: LuClock };
        } else if (daysUntil <= 3) {
            return { label: `${daysUntil} dias`, color: "bg-yellow-50 border-yellow-200", textColor: "text-yellow-600", icon: LuClock };
        } else if (daysUntil <= 7) {
            return { label: `${daysUntil} dias`, color: "bg-blue-50 border-blue-200", textColor: "text-blue-600", icon: LuClock };
        }
        return null;
    };

    const upcomingCommitments = commitments
        .map(commitment => ({
            ...commitment,
            dateInfo: getDateLabel(commitment.date)
        }))
        .filter(commitment => commitment.dateInfo !== null);

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-xl">
                        <LuCalendar size={20} className="text-blue-950" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg sm:text-xl text-gray-900">Compromissos Próximos</h2>
                        <p className="text-xs sm:text-sm text-gray-500">Seus próximos compromissos</p>
                    </div>
                </div>
                <Link
                    to="/calendar"
                    className="text-xs sm:text-sm text-blue-950 hover:underline font-medium"
                >
                    Ver todos
                </Link>
            </div>

            {upcomingCommitments.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">Nenhum compromisso próximo</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {upcomingCommitments.slice(0, 5).map((commitment) => {
                        const dateInfo = commitment.dateInfo!;
                        const Icon = dateInfo.icon;
                        const typeConfig = COMMITMENT_TYPES.find(t => t.value === commitment.type);

                        return (
                            <div
                                key={commitment.id}
                                className={`border rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] ${dateInfo.color}`}
                            >
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                                            {commitment.name}
                                        </h3>
                                        {commitment.course && (
                                            <p className="text-xs text-gray-600 mt-1 truncate">
                                                {commitment.course.name}
                                            </p>
                                        )}
                                        {commitment.description && (
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                {commitment.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${dateInfo.textColor} bg-white/60 shrink-0`}>
                                        <Icon size={14} />
                                        <span className="text-xs font-semibold">{dateInfo.label}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-2 text-xs">
                                    <span className="text-gray-600">
                                        {format(new Date(commitment.date), "dd 'de' MMMM", { locale: ptBR })}
                                    </span>
                                    {typeConfig && (
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeConfig.colors.bg} ${typeConfig.colors.text}`}>
                                            {typeConfig.label}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

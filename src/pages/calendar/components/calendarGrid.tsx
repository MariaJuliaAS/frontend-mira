import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, parse, startOfMonth, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { COMMITMENT_TYPES } from "../constants/commitmentTypes";
import type { CommitmentsProps } from "../types/calendarTypes";

interface Props {
    commitments: CommitmentsProps[];
    currentDate: Date;
    setSelectedDate: (date: Date) => void;
    selectedDate: Date;
}

export function CalendarGrid({ commitments, currentDate, setSelectedDate, selectedDate }: Props) {

    function getMonthDays(date: Date) {
        const start = startOfWeek(startOfMonth(date), { locale: ptBR });
        const end = endOfWeek(endOfMonth(date), { locale: ptBR });

        return eachDayOfInterval({ start, end });
    }

    const days = getMonthDays(currentDate);

    return (
        <>
            <div className="grid grid-cols-7 mb-2 text-center text-sm font-medium text-gray-500">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => (
                    <span key={day}>{day}</span>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-4">
                {days.map((day) => (
                    <div key={day.toString()}
                        onClick={() => setSelectedDate(day)}
                        className={`flex flex-col border border-gray-300 rounded-tr-xl rounded-bl-xl font-semibold p-2 sm:min-h-22 min-h-12 cursor-pointer transition-all duration-300 hover:bg-blue-800/40 hover:text-blue-950
                                                            ${isSameDay(day, selectedDate) ? "bg-blue-800/60 text-blue-950" : ""} ${isSameMonth(day, currentDate) ? "" : "opacity-40"}`}>
                        <span>
                            {format(day, "d")}
                        </span>
                        <div className="grid-cols-6 grid mt-2">
                            {commitments.map((c) => {
                                const typeConfig = COMMITMENT_TYPES.find(
                                    (t) => t.value === c.type)

                                return isSameDay(c.date, day) ?
                                    (<span key={c.id} className={`w-2 h-2 rounded-full ${typeConfig?.colors.solid}`} />) :
                                    ""
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
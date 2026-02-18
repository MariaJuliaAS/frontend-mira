import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LuCalendar } from "react-icons/lu";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface CalendarHeaderProps {
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    setSelectedDate: (date: Date) => void;
}

export function CalendarHeader({ currentDate, setCurrentDate, setSelectedDate }: CalendarHeaderProps) {
    const monthLabel = format(currentDate, "MMMM yyyy", { locale: ptBR });

    function prevMonth() {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setSelectedDate(new Date());
    }

    function nextMonth() {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setSelectedDate(new Date());
    }

    return (
        <header className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold capitalize flex items-center gap-2">
                <LuCalendar size={18} />
                {monthLabel}
            </h2>

            <div className="flex gap-2">
                <button
                    onClick={prevMonth}
                    className="p-2 rounded-lg cursor-pointer border border-gray-200 hover:bg-gray-100 transition"
                >
                    <IoIosArrowBack size={16} />
                </button>
                <button
                    onClick={nextMonth}
                    className="p-2 rounded-lg cursor-pointer border border-gray-200  hover:bg-gray-100 transition"
                >
                    <IoIosArrowForward size={16} />
                </button>
            </div>
        </header>
    );
}
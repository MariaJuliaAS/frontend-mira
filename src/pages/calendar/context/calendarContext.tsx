import { createContext, useContext, useState } from "react";
import type { CalendarContextData, CommitmentsProps } from "../types/calendarTypes";

const CalendarContext = createContext<CalendarContextData | null>(null);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentDate, setCurrentDate] = useState(new Date());
    const [commitmentSelected, setCommitmentSelected] = useState<CommitmentsProps>();

    return (
        <CalendarContext.Provider value={{
            selectedDate,
            setSelectedDate,
            currentDate,
            setCurrentDate,
            commitmentSelected,
            setCommitmentSelected
        }}>
            {children}
        </CalendarContext.Provider>
    )
}

export function useCalendar() {
    const context = useContext(CalendarContext);
    if (!context) {
        throw new Error("useCalendar must be used inside CalendarProvider");
    }
    return context;
}
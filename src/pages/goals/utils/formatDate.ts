import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDateIgnoringTimezone(
    dateString: string | Date,
    formatString: string = "dd 'de' MMM', ' yyyy"
): string {
    let date: Date;

    if (typeof dateString === "string") {
        const datePart = dateString.split("T")[0];
        const timePart = dateString.split("T")[1]?.split("Z")[0]?.split("+")[0]?.split("-")[0] || "00:00:00";

        const [year, month, day] = datePart.split("-").map(Number);
        const [hours = 0, minutes = 0, seconds = 0] = timePart.split(":").map(Number);

        date = new Date(year, month - 1, day, hours, minutes, seconds);
    } else {
        date = dateString;
    }

    return format(date, formatString, { locale: ptBR });
}

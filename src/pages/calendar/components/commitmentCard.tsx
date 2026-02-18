import { LuCalendar } from "react-icons/lu";
import { format, isSameDay, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { COMMITMENT_TYPES } from "../constants/commitmentTypes";
import { TbTrash } from "react-icons/tb";
import { useEffect, useMemo } from "react";
import type { CommitmentsProps } from "../types/calendarTypes";

interface Props {
    commitments: CommitmentsProps[];
    onDelete: (id: string) => void;
    onDetail: () => void;
    refresh?: () => void;
    selectedDate: Date;
    setCommitmentSelected: (commitment: CommitmentsProps) => void;
}


export function CommitmentCard({ commitments, onDelete, refresh, onDetail, selectedDate, setCommitmentSelected }: Props) {

    const today = new Date();

    const filteredCommitments = useMemo(() =>
        commitments.filter((c) =>
            isSameDay(parse(c.date, "dd/MM/yyyy", new Date()), selectedDate)
        ), [commitments, selectedDate]
    );

    useEffect(() => { refresh && refresh() }, [commitments.length])

    return (
        <>
            <h2 className="text-lg font-semibold capitalize flex items-center gap-2">
                <LuCalendar size={18} />
                {isSameDay(today, selectedDate) ? "Hoje" : format(selectedDate, "dd, MMMM", { locale: ptBR })}
            </h2>

            {filteredCommitments.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                    Nenhum compromisso registrado
                </p>
            )}

            {filteredCommitments.map((c) => {
                const typeConfig = COMMITMENT_TYPES.find(
                    (t) => t.value === c.type
                )

                return (
                    <div key={c.id} className="flex gap-2">
                        <div
                            onClick={() => { onDetail(), setCommitmentSelected(c) }}
                            className={`cursor-pointer w-full flex items-center justify-between gap-4 px-4 py-2 rounded-xl mb-3 ${typeConfig?.colors.bg} ring-1 ${typeConfig?.colors.ring} my-4 transition-all duration-300 hover:scale-105`}>
                            <div className="flex flex-col">
                                <p className="font-semibold" >{c.name}</p>
                                {c.course?.name && (
                                    <span className="text-sm text-gray-400">{c.course.name}</span>
                                )}
                            </div>
                            <span className={`border ${typeConfig?.colors.text} px-3 rounded-full text-sm `}>{typeConfig?.label}</span>
                        </div>
                        <button onClick={() => onDelete(c.id)} className="transition-all duration-300 hover:text-red-600 cursor-pointer">
                            <TbTrash size={20} />
                        </button>
                    </div>
                )
            })}
        </>
    )

}
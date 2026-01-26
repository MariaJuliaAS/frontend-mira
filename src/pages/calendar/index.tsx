import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    parse,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { useEffect, useState } from "react";
import { api } from "../../service/api";
import { Container } from "../../components/container";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { LuCalendar } from "react-icons/lu";
import { Button } from "../../components/ui/Button";
import { FiPlus } from "react-icons/fi";
import { TbTrash } from "react-icons/tb";
import { CommitmentModal } from "../../components/modals/commitmentModal";
import { DetailCommitmentModal } from "../../components/modals/detailCommitmentDetail";

const COMMITMENT_TYPES = [
    {
        label: "Prova",
        value: "PROVA",
        colors: {
            bg: "bg-red-500/15",
            text: "text-red-400",
            ring: "ring-red-400/40",
            solid: "bg-red-500",
        },
    },
    {
        label: "Trabalho",
        value: "TRABALHO",
        colors: {
            bg: "bg-blue-500/15",
            text: "text-blue-400",
            ring: "ring-blue-400/40",
            solid: "bg-blue-500",
        },
    },
    {
        label: "Atividade",
        value: "ATIVIDADE",
        colors: {
            bg: "bg-emerald-500/15",
            text: "text-emerald-400",
            ring: "ring-emerald-400/40",
            solid: "bg-emerald-500",
        },
    },
    {
        label: "Evento",
        value: "EVENTO",
        colors: {
            bg: "bg-orange-500/15",
            text: "text-orange-400",
            ring: "ring-orange-400/40",
            solid: "bg-orange-500",
        },
    },
    {
        label: "Outro",
        value: "OUTRO",
        colors: {
            bg: "bg-purple-500/15",
            text: "text-purple-400",
            ring: "ring-purple-400/40",
            solid: "bg-purple-500",
        },
    },
]

interface CommitmentsProps {
    id: string;
    name: string;
    date: string;
    type: "Prova" | "Trabalho" | "Atividade" | "Evento" | "Outro";
    description?: string;
    course?: CourseProps;
}

interface CourseProps {
    id: string;
    name: string;
    teacher?: string;
}

function getMonthDays(date: Date) {
    const start = startOfWeek(startOfMonth(date), { locale: ptBR });
    const end = endOfWeek(endOfMonth(date), { locale: ptBR });

    return eachDayOfInterval({ start, end });
}

export function Calendar() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [currentDate, setCurrentDate] = useState(new Date());
    const [commitments, setCommitments] = useState<CommitmentsProps[]>([]);
    const [commitmentSelected, setCommitmentSelected] = useState<CommitmentsProps>();
    const [createModalIsOpen, setCreateModalIsOpen] = useState<Boolean>(false);
    const [detailModalIsOpen, setDetailModalIsOpen] = useState<Boolean>(false);

    const today = new Date();
    const days = getMonthDays(currentDate);
    const monthLabel = format(currentDate, "MMMM yyyy", { locale: ptBR });

    function handlePrevMonth() {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
        setSelectedDate(new Date());
    }

    function handleNextMonth() {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
        setSelectedDate(new Date());
    }

    async function fetchCommitments() {
        const token = localStorage.getItem("@tokenMira");

        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const response = await api.get("/commitment/all", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCommitments(response.data);
        } catch (error) {
            console.error("Erro ao buscar compromissos ", error)
        }
    }

    useEffect(() => {
        fetchCommitments();
    }, [])

    async function deleteCommitment(id: string) {
        const token = localStorage.getItem("@tokenMira");

        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            await api.delete(`/commitment/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCommitments(commitments.filter(commitment => commitment.id !== id));
            alert("Compromisso deletado com sucesso");
        } catch (error) {
            console.error("Erro ao deletar compromisso:", error);
        }
    }

    return (
        <main className="bg-zinc-200/10 min-h-screen">
            <Container>

                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-bold text-2xl sm:text-3xl">Calendário</h1>
                        <span className="text-zinc-500 text-sm sm:text-base">
                            Gerencie todos os seus compromissos acadêmicos em um só lugar.
                        </span>
                    </div>

                    <Button
                        type="button"
                        onClick={() => setCreateModalIsOpen(true)}
                    >
                        <FiPlus size={18} className="mr-2" />
                        Novo Compromisso
                    </Button>
                </header>

                <div className="flex flex-wrap gap-3 my-6">
                    {COMMITMENT_TYPES.map((type) => (
                        <div
                            key={type.value}
                            className="flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-white shadow-sm"
                        >
                            <span className={`w-2.5 h-2.5 rounded-full ${type.colors.solid}`} />
                            <span className="text-sm font-medium text-gray-700">
                                {type.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="flex w-full gap-8 mb-6 lg:flex-row flex-col">
                    <section className="flex-3 bg-white border border-gray-200 rounded-2xl p-4 shadow-lg">
                        <header className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold capitalize flex items-center gap-2">
                                <LuCalendar size={18} />
                                {monthLabel}
                            </h2>

                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrevMonth}
                                    className="p-2 rounded-lg cursor-pointer border border-gray-200 hover:bg-gray-100 transition"
                                >
                                    <IoIosArrowBack size={16} />
                                </button>
                                <button
                                    onClick={handleNextMonth}
                                    className="p-2 rounded-lg cursor-pointer border border-gray-200  hover:bg-gray-100 transition"
                                >
                                    <IoIosArrowForward size={16} />
                                </button>
                            </div>
                        </header>

                        <div className="grid grid-cols-7 mb-2 text-center text-sm font-medium text-gray-500">
                            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => (
                                <span key={day}>{day}</span>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-4">
                            {days.map((day) => (
                                <div key={day.toString()}
                                    onClick={() => setSelectedDate(day)}
                                    className={`flex flex-col border border-gray-300 rounded-tr-xl rounded-bl-xl font-semibold p-2 min-h-22 cursor-pointer transition-all duration-300 hover:bg-blue-800/40 hover:text-blue-950
                                    ${isSameDay(day, selectedDate) ? "bg-blue-800/60 text-blue-950" : ""} ${isSameMonth(day, currentDate) ? "" : "opacity-40"}`}>
                                    <span>
                                        {format(day, "d")}
                                    </span>
                                    <div className="grid-cols-6 grid mt-2">
                                        {commitments.map((c) => {
                                            const typeConfig = COMMITMENT_TYPES.find(
                                                (t) => t.value === c.type)

                                            return isSameDay(parse(c.date, "dd/MM/yyyy", new Date()), day) ?
                                                (<span key={c.id} className={`w-2 h-2 rounded-full ${typeConfig?.colors.solid}`} />) :
                                                ""
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-gray-200 p-6 shadow-lg flex-1">
                        <h2 className="text-lg font-semibold capitalize flex items-center gap-2">
                            <LuCalendar size={18} />
                            {isSameDay(today, selectedDate) ? "Hoje" : format(selectedDate, "dd, MMMM", { locale: ptBR })}
                        </h2>

                        {commitments.
                            filter((c) => isSameDay(parse(c.date, "dd/MM/yyyy", new Date()), selectedDate))
                            .length === 0 && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Nenhum compromisso registrado
                                </p>
                            )}

                        {commitments
                            .filter((c) =>
                                isSameDay(
                                    parse(c.date, "dd/MM/yyyy", new Date()),
                                    selectedDate))
                            .map((c) => {
                                const typeConfig = COMMITMENT_TYPES.find(
                                    (t) => t.value === c.type
                                )

                                return (
                                    <div key={c.id}
                                        onClick={() => { setDetailModalIsOpen(true), setCommitmentSelected(c) }}
                                        className={`cursor-pointer w-full flex items-center justify-between gap-4 px-4 py-2 rounded-xl mb-3 ${typeConfig?.colors.bg} ring-1 ${typeConfig?.colors.ring} my-4 transition-all duration-300 hover:scale-105`}>
                                        <div className="flex flex-col">
                                            <p className="font-semibold" >{c.name}</p>

                                            <div>
                                                {c.course?.name && (
                                                    <span className="text-sm text-gray-400">{c.course.name} • </span>
                                                )}
                                                <span className="text-sm text-gray-400">{typeConfig?.label}</span>
                                            </div>
                                        </div>

                                        <button onClick={() => deleteCommitment(c.id)} className="transition-all duration-300 hover:text-red-600 cursor-pointer">
                                            <TbTrash size={20} />
                                        </button>
                                    </div>
                                )
                            })}
                    </section>
                </div>
            </Container>

            {createModalIsOpen && <CommitmentModal closeModal={() => setCreateModalIsOpen(false)} onSuccess={fetchCommitments} />}
            {detailModalIsOpen && <DetailCommitmentModal closeModal={() => setDetailModalIsOpen(false)} commitment={commitmentSelected} onSuccess={fetchCommitments} />}

        </main>
    )
}
import { FiPlus } from "react-icons/fi";
import { Container } from "../../components/container";
import { Button } from "../../components/ui/Button";
import { api } from "../../service/api";
import { useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LuTarget } from "react-icons/lu";
import { TbTrash } from "react-icons/tb";
import { BsLightning } from "react-icons/bs";
import { ConfirmDelete } from "../../components/modals/confirmDelete";

export interface GoalsProps {
    id: string;
    name: string;
    description: string;
    end_date: string;
    course?: {
        id: string;
        name: string;
    };
    goalsTopcis?: {
        id: string;
        name: string;
        completed?: boolean;
    }[];
}

export function Goals() {
    const [goalList, setGoalList] = useState<GoalsProps[]>([]);
    const [goalSelected, setGoalSelected] = useState<GoalsProps | null>(null);
    const [modalConfirmDelete, setModalConfirmDelete] = useState<boolean>(false);

    async function fecthGoals() {
        const token = localStorage.getItem("@tokenMira");

        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const response = await api.get("/goal", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setGoalList(response.data);
        } catch (error) {
            console.error("Erro ao buscar metas: ", error)
        }
    }

    useEffect(() => {
        fecthGoals();
    }, [])

    async function toggleTopicCompletion(id: string) {
        const token = localStorage.getItem("@tokenMira");
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const isCompleted = !goalSelected?.goalsTopcis?.find(t => t.id === id)?.completed;

            await api.put(`/goal/topic/${id}`, {
                completed: isCompleted
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (goalSelected) {
                const updateTopics = goalSelected.goalsTopcis?.map(t => t.id === id ?
                    { ...t, completed: isCompleted } : t
                )
                const updatedGoal = {
                    ...goalSelected,
                    goalsTopcis: updateTopics
                }

                setGoalSelected(updatedGoal);
                setGoalList(goalList.map(g => g.id === goalSelected.id ? updatedGoal : g))
            }

        } catch (error) {
            console.error("Erro ao atualizar tópico: ", error)
        }
    }

    async function deleteGoalTopic(id: string) {
        const token = localStorage.getItem("@tokenMira");

        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            await api.delete(`/goal/topic/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (goalSelected) {
                const updateTopics = goalSelected.goalsTopcis?.filter(t => t.id !== id)
                const updatedGoal = {
                    ...goalSelected,
                    goalsTopcis: updateTopics
                }

                setGoalSelected(updatedGoal);
                setGoalList(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
            }
            alert("Tópico deletado com sucesso");
        } catch (error) {
            console.error("Erro ao deletar tópico: ", error)
        }
    }

    async function deleteGoal(id: string) {
        const token = localStorage.getItem("@tokenMira");

        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            await api.delete(`/goal/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const updateGoals = goalList.filter(g => g.id !== id)
            setGoalList(updateGoals);

            if (goalSelected?.id === id) {
                setGoalSelected(null);
            }

            alert("Meta deletada com sucesso");
        } catch (error) {
            console.error("Erro ao deletar meta: ", error)
        }
    }


    return (
        <main className="bg-zinc-200/10 min-h-screen">
            <Container>

                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-bold text-2xl sm:text-3xl">Metas</h1>
                        <span className="text-zinc-500 text-sm sm:text-base">
                            Defina e acompanhe seus objetivos
                        </span>
                    </div>

                    <Button
                        type="button"
                    >
                        <FiPlus size={18} className="mr-2" />
                        Nova Meta
                    </Button>
                </header>

                <div className="mt-8 sm:mt-12 flex w-full gap-8">
                    <section className="w-full flex-1">

                        {goalList.map((g) => (
                            <div className="flex items-center gap-6 relative">
                                <div key={g.id} onClick={() => setGoalSelected(g)} className={`w-full bg-white border rounded-2xl p-4 shadow-lg mb-4 transition-all duration-300 cursor-pointer hover:scale-105 hover:border-blue-950 ${goalSelected?.id == g.id ? "border-blue-950 scale-105" : "border-gray-200"}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-semibold">
                                                <LuTarget size={24} className="text-blue-950" />
                                            </div>

                                            <div>
                                                <h2 className="sm:text-lg text-base font-semibold text-gray-900">
                                                    {g.name}
                                                </h2>
                                                <p className="text-sm text-gray-500">
                                                    Prazo: {format(
                                                        parse(g.end_date, "dd/MM/yyyy", new Date()),
                                                        "MMM yyyy",
                                                        { locale: ptBR }
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); setModalConfirmDelete(true); setGoalSelected(g) }} className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm">
                                            <TbTrash size={16} />
                                        </button>
                                    </div>

                                    <div className="flex gap-3 mt-2">
                                        {g.course && (
                                            <span className="text-sm text-gray-500">
                                                {g.course.name}
                                            </span>
                                        )}

                                        {g.goalsTopcis && (
                                            <span className="text-sm text-gray-500 flex items-center">
                                                <BsLightning size={16} className="text-blue-600" />
                                                {g.goalsTopcis?.length} tópico(s)
                                            </span>
                                        )}

                                    </div>
                                </div>
                            </div>
                        ))}

                    </section>
                    <section className="w-full flex-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                        {goalSelected ? (
                            <div>
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-xl">{goalSelected?.name}</p>
                                        <span className="italic text-gray-500">{goalSelected?.description}</span>
                                    </div>
                                    <span className="text-gray-500">
                                        {format(
                                            parse(goalSelected?.end_date, "dd/MM/yyyy", new Date()),
                                            "MMM yyyy",
                                            { locale: ptBR }
                                        )}
                                    </span>
                                </div>

                                <div className="mt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-lg">Tópicos Técnicos</h3>
                                        <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 cursor-pointer hover:bg-blue-950 hover:text-white transition-all duration-300">
                                            <FiPlus size={18} />
                                            Adicionar Tópico
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {goalSelected.goalsTopcis && goalSelected.goalsTopcis.length > 0 ? (
                                            goalSelected.goalsTopcis.map((t) => (
                                                <div
                                                    key={t.id}
                                                    className={`flex items-center justify-between gap-3 rounded-xl border p-4 transition-all duration-300 ${t.completed ? "border-green-500 bg-green-500/30" : "border-gray-300 bg-white hover:border-blue-950"}`}
                                                >
                                                    <div onClick={() => toggleTopicCompletion(t.id)} className="flex gap-2 cursor-pointer">
                                                        <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-400 transition-all duration-300 ${t.completed ? "border-none" : ""} `}>
                                                            {t.completed && (
                                                                <div className="bg-green-500/80 rounded-full h-6 w-6 text-white text-center">
                                                                    ✓
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className={`font-medium text-sm ${t.completed ? "text-green-500" : "text-gray-900"}`}>{t.name} </p>
                                                    </div>
                                                    <button onClick={() => deleteGoalTopic(t.id)} className="transition-all duration-300 hover:text-red-600 cursor-pointer">
                                                        <TbTrash size={20} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-8">
                                                <p className="text-gray-400 text-sm">Nenhum tópico adicionado ainda</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="text-gray-500">Selecione uma meta para ver os detalhes</p>
                            </div>
                        )}
                    </section>
                </div >

            </Container >
            {modalConfirmDelete && <ConfirmDelete closeModal={() => setModalConfirmDelete(false)} goal={goalSelected} deleteGoal={deleteGoal} />}
        </main >
    )
}
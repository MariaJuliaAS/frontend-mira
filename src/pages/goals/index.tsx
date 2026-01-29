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

interface GoalsProps {
    id: string;
    name: string;
    description: string;
    end_date: string;
    course?: {
        id: string;
        name: string;
    };
    goalsTopic?: {
        id: string;
        name: string;
    }[];
}

export function Goals() {
    const [goalList, setGoalList] = useState<GoalsProps[]>([]);
    const [goalSelected, setGoalSelected] = useState<GoalsProps | null>(null);

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
                            <div onClick={() => setGoalSelected(g)} className={`w-full bg-white border rounded-2xl p-4 shadow-lg mb-4 transition-all duration-300 cursor-pointer hover:scale-105 hover:border-blue-950 ${goalSelected?.id == g.id ? "border-blue-950 scale-105" : "border-gray-200"}`} key={g.id}>
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
                                </div>

                                <div className="flex gap-3 mt-2">
                                    {g.course && (
                                        <span className="text-sm text-gray-500">
                                            {g.course.name}
                                        </span>
                                    )}

                                    {g.goalsTopic && (
                                        <span className="text-sm text-gray-500 flex items-center">
                                            <BsLightning size={16} className="text-blue-600" />
                                            {g.goalsTopic?.length} tópico(s)
                                        </span>
                                    )}

                                </div>
                            </div>
                        ))}

                    </section>
                    <section className="w-full flex-2 bg-white border border-gray-200 rounded-2xl p-4 shadow-lg">
                        <h1>section 2</h1>
                    </section>
                </div>

            </Container>
        </main>
    )
}
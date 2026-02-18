import { Container } from "../../components/container";
import { Button } from "../../components/ui/Button";
import { FiPlay, FiPause, FiRotateCcw, FiTrash2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useStopwatch } from "react-timer-hook"
import { LuBookOpen, LuClock, LuTarget } from "react-icons/lu";
import { CiCircleQuestion, CiVideoOn, CiViewList } from "react-icons/ci";
import { IoReload } from "react-icons/io5";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/ui/Input";
import { api } from "../../service/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const schema = z.object({
    topic: z.string().min(1, "O tópico é obrigatório"),
    pages: z.string().optional(),
    questions: z.string().optional(),
    correctQuestions: z.string().optional(),
    video: z.string().optional(),
    revision: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

interface CourseProps {
    id: string;
    name: string;
}

interface GoalsProps {
    id: string;
    name: string;
}

interface SessionProps {
    id: string;
    time: number;
    topic: string;
    pages: number;
    questions: number;
    correctQuestions: number;
    video: number;
    revision: boolean;
    created_at: string;
    course?: CourseProps;
    goal?: GoalsProps;
}

export function Timers() {
    const [isRunning, setIsRunning] = useState(false);
    const [typeSelected, setTypeSelected] = useState<"Matéria" | "Meta">("Matéria");
    const [typeSelectedId, setTypeSelectedId] = useState<string | null>(null);
    const [courseList, setCourseList] = useState<CourseProps[]>([]);
    const [goalList, setGoalList] = useState<GoalsProps[]>([]);
    const [sessionsList, setSessionsList] = useState<SessionProps[]>([]);

    const { start, pause, reset, seconds, minutes, hours } = useStopwatch({ autoStart: false });
    const { register, handleSubmit, formState: { errors }, reset: resetForm } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const disabledDetails = !isRunning && totalSeconds > 0;
    const startTimer = typeSelectedId !== null;

    async function fetchCourses() {
        const token = localStorage.getItem("@tokenMira");

        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const response = await api.get("/course/all", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setCourseList(response.data);
        } catch (err) {
            console.error("Error fetching courses", err);
        }
    }

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

    async function fetchSessions() {
        const token = localStorage.getItem("@tokenMira");

        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const response = await api.get("/timers", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSessionsList(response.data);
        } catch (error) {
            console.error("Erro ao buscar sessões: ", error)
        }
    }

    useEffect(() => {
        fetchCourses();
        fecthGoals();
        fetchSessions();
    }, [])

    async function onSubmit(data: FormData) {
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        const token = localStorage.getItem("@tokenMira");

        if (!token) {
            console.error("No token found");
            return;
        }

        const pages = data.pages ? parseInt(data.pages) : 0;
        const video = data.video ? parseInt(data.video) : 0;
        const questions = data.questions ? parseInt(data.questions) : 0;
        const correctQuestions = data.correctQuestions ? parseInt(data.correctQuestions) : 0;

        try {
            if (typeSelected === "Matéria") {
                await api.post(`/timer/courses/${typeSelectedId}`, {
                    topic: data.topic,
                    time: totalSeconds,
                    pages,
                    video,
                    questions,
                    correctQuestions,
                    revision: data.revision || false
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            } else {
                await api.post(`/timer/goals/${typeSelectedId}`, {
                    topic: data.topic,
                    time: totalSeconds,
                    pages,
                    video,
                    questions,
                    correctQuestions,
                    revision: data.revision || false
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            }
            alert("Sessão de estudo salva com sucesso!");
            location.reload();
        } catch (err) {
            console.error("Erro ao criar sessão de estudo: ", err);
        }
    }

    function secondsToHours(totalSeconds: number) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours}h${minutes}m${seconds}s`;
    }

    async function handleDeleteSession(id: string) {
        const token = localStorage.getItem("@tokenMira");

        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            await api.delete(`/timer/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            alert("Sessão de estudo deletada!")
            location.reload();
        } catch (err) {
            console.error("Erro ao deletar sessão de estudo: ", err)
        }
    }

    return (
        <main className="bg-zinc-200/10 min-h-screen">
            <Container>
                <header className="flex flex-col gap-2 sm:gap-4 sm:flex-row sm:items-center sm:justify-between px-2 sm:px-0">
                    <div>
                        <h1 className="font-bold text-xl sm:text-2xl md:text-3xl">Acompanhamento de Estudos</h1>
                        <span className="text-zinc-500 text-xs sm:text-sm md:text-base">
                            Registre suas sessões e acompanhe seu tempo de estudo
                        </span>
                    </div>
                </header>

                <div className="w-full min-h-full mt-6 sm:mt-8 md:mt-12 flex flex-col lg:flex-row lg:gap-8 gap-4 px-2 sm:px-0">
                    <div className="flex flex-col flex-1 gap-4">
                        <section className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-blue-100 text-blue-600 font-semibold shrink-0">
                                    <LuClock size={18} className="sm:w-6 sm:h-6 text-blue-950" />
                                </div>
                                <h2 className="font-semibold text-base sm:text-lg">Cronômetro</h2>
                            </div>

                            <div className="text-center mt-6 sm:mt-8 bg-blue-300/30 rounded-full h-20 sm:h-24 md:h-28 flex items-center justify-center">
                                <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-950">{String(hours).padStart(2, "0")}:
                                    {String(minutes).padStart(2, "0")}:
                                    {String(seconds).padStart(2, "0")}</h3>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 mt-6 sm:mt-8 mb-4 sm:mb-6">
                                <button onClick={() => { setTypeSelected("Matéria"), setTypeSelectedId(null) }} className={`${typeSelected === "Matéria" ? "bg-blue-950 text-white" : ""} w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 sm:px-4 py-2 sm:py-1.5 text-xs sm:text-sm text-gray-600 cursor-pointer hover:bg-blue-950 hover:text-white transition-all duration-300`}>Matéria</button>
                                <button onClick={() => { setTypeSelected("Meta"), setTypeSelectedId(null) }} className={`${typeSelected === "Meta" ? "bg-blue-950 text-white" : ""} w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 sm:px-4 py-2 sm:py-1.5 text-xs sm:text-sm text-gray-600 cursor-pointer hover:bg-blue-950 hover:text-white transition-all duration-300`}>Meta</button>
                                {typeSelected === "Matéria" ? (
                                    <select
                                        className="rounded-lg border-2 border-gray-200 w-full sm:flex-1 outline-none px-2 sm:px-3 py-2 bg-white text-xs sm:text-sm"
                                        onChange={(e) => setTypeSelectedId(e.target.value)}
                                    >
                                        <option value="">Selecione uma matéria</option>
                                        {courseList.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <select
                                        className="rounded-lg border-2 border-gray-200 w-full sm:flex-1 outline-none px-2 sm:px-3 py-2 bg-white text-xs sm:text-sm"
                                        onChange={(e) => setTypeSelectedId(e.target.value)}
                                    >
                                        <option value="">Selecione uma meta</option>
                                        {goalList.map((g) => (
                                            <option key={g.id} value={g.id}>
                                                {g.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-2">
                                <Button
                                    width={`w-full sm:w-auto ${startTimer ? '' : 'opacity-50 hover:cursor-default'}`}
                                    type="button"
                                    disabled={!startTimer}
                                    onClick={() => {
                                        if (isRunning) {
                                            pause();
                                            setIsRunning(false);
                                        } else {
                                            start();
                                            setIsRunning(true);
                                        }
                                    }}
                                >
                                    {isRunning ? <FiPause size={16} className="mr-1 sm:mr-2" /> : <FiPlay size={16} className="mr-1 sm:mr-2" />}
                                    {isRunning ? "Pausar" : "Iniciar"}
                                </Button>
                                <Button type="button" width="w-full sm:w-auto" onClick={() => { reset(new Date(0), false); setIsRunning(false); }}>
                                    <FiRotateCcw size={16} className="mr-1 sm:mr-2" />
                                    Limpar
                                </Button>
                            </div>
                        </section>

                        <section className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                            <h2 className="font-semibold text-base sm:text-lg mb-4">Detalhes da Sessão</h2>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-4">
                                    <label className="block text-xs sm:text-sm font-medium mb-1">Tópico</label>
                                    <Input
                                        type="text"
                                        name="topic"
                                        placeholder="Ex.: POO"
                                        register={register}
                                        error={errors.topic?.message}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="flex items-center text-gray-500 text-xs sm:text-sm bg-blue-300/20 py-1 px-2 rounded-lg border border-blue-300/30 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            {...register("revision")}
                                            className="mr-2 cursor-pointer"
                                        />
                                        <IoReload size={12} className="mr-1 shrink-0" />
                                        <span className="whitespace-nowrap">Esta sessão é uma revisão</span>
                                    </label>
                                </div>
                                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium mb-1">Páginas Lidas</label>
                                        <Input
                                            type="number"
                                            name="pages"
                                            placeholder="0"
                                            register={register}
                                            error={errors.pages?.message}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium mb-1">Min de Vídeo</label>
                                        <Input
                                            type="number"
                                            name="video"
                                            placeholder="0"
                                            register={register}
                                            error={errors.video?.message}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium mb-1">Total de Questões</label>
                                        <Input
                                            type="number"
                                            name="questions"
                                            placeholder="0"
                                            register={register}
                                            error={errors.questions?.message}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium mb-1">Questões Certas</label>
                                        <Input
                                            type="number"
                                            name="correctQuestions"
                                            placeholder="0"
                                            register={register}
                                            error={errors.correctQuestions?.message}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Button width={`flex-1 ${disabledDetails ? '' : 'opacity-50 hover:cursor-default'}`} type="submit" disabled={!disabledDetails}>
                                        <span className="py-1">Salvar Sessão</span>
                                    </Button>
                                    <button
                                        onClick={() => resetForm()}
                                        className="cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-red-600 hover:text-white text-red-600 px-3 sm:px-4 py-1 sm:py-2 flex justify-center items-center gap-1 sm:gap-2 bg-zinc-200/10 rounded-md border border-gray-200 text-xs sm:text-sm">
                                        Limpar campos
                                    </button>
                                </div>
                            </form>
                        </section>
                    </div>

                    <section className="flex flex-1 bg-white border border-gray-200 rounded-xl sm:rounded-2xl py-4 sm:py-6 shadow-lg min-h-max">
                        <div className="w-full">
                            <h2 className="font-semibold text-base sm:text-lg mb-4 px-4">Sessões recentes</h2>
                            <div className="max-h-96 sm:max-h-none overflow-y-auto">
                                {sessionsList.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8 px-4 text-sm">Nenhuma sessão registrada ainda</p>
                                ) : (
                                    sessionsList.map(session => (
                                        <div key={session.id} className="pb-2 border-y border-gray-200 py-3 sm:py-4 w-full">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-4 gap-3 sm:gap-4 w-full">
                                                <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                                                    <div className="bg-blue-300/30 p-1.5 sm:p-2 rounded-lg shrink-0">
                                                        {session.course != null ?
                                                            <LuBookOpen size={16} className="sm:w-5 sm:h-5 text-blue-950" /> :
                                                            <LuTarget size={16} className="sm:w-5 sm:h-5 text-blue-950" />
                                                        }
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap gap-2 sm:gap-2 items-center">
                                                            <p className="font-medium text-xs sm:text-sm truncate">
                                                                {session.course?.name || session.goal?.name}
                                                            </p>
                                                            {session.revision ? (<span className="bg-blue-300/20 text-gray-500 rounded-xl px-1.5 sm:px-2 py-0.5 flex items-center text-xs gap-0.5 shrink-0"><IoReload size={10} className="sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Revisão</span></span>) : ""}
                                                        </div>
                                                        <span className="text-gray-500 text-xs block truncate mt-1">{session.topic}</span>
                                                        <p className="text-gray-500 text-xs flex items-center flex-wrap gap-2 mt-1.5 sm:mt-2">
                                                            <CiViewList size={12} className="shrink-0" /> <span className="truncate">{session.pages}p</span>
                                                            <CiVideoOn size={12} className="shrink-0" /> <span className="truncate">{session.video}m</span>
                                                            <CiCircleQuestion size={12} className="shrink-0" /> <span className="truncate">{session.correctQuestions}/{session.questions}q</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1 shrink-0">
                                                    <p className="font-medium text-xs sm:text-sm">
                                                        {secondsToHours(session.time)}
                                                    </p>

                                                    <p className="text-xs text-gray-500 whitespace-nowrap">
                                                        {format(session.created_at, "dd'/'MM", { locale: ptBR })}
                                                    </p>

                                                    <button
                                                        onClick={() => handleDeleteSession(session.id)}
                                                        className="mt-0.5 sm:mt-1 flex items-center gap-0.5 text-xs text-red-600 hover:text-red-700 transition underline cursor-pointer hover:scale-105"
                                                    >
                                                        <FiTrash2 size={12} className="shrink-0" />
                                                        <span className="hidden sm:inline">Excluir</span>
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </Container>
        </main>
    )
}
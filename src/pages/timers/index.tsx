import { Container } from "../../components/container";
import { Button } from "../../components/ui/Button";
import { FiPlay, FiPause, FiRotateCcw } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useStopwatch } from "react-timer-hook"
import { LuBookOpen, LuClock } from "react-icons/lu";
import { CiCircleQuestion, CiVideoOn, CiViewList } from "react-icons/ci";
import { IoReload } from "react-icons/io5";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/ui/Input";
import { api } from "../../service/api";

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

export function Timers() {
    const [isRunning, setIsRunning] = useState(false);
    const [typeSelected, setTypeSelected] = useState<"Matéria" | "Meta">("Matéria");
    const [typeSelectedId, setTypeSelectedId] = useState<string | null>(null);
    const [courseList, setCourseList] = useState<CourseProps[]>([]);
    const [goalList, setGoalList] = useState<GoalsProps[]>([]);

    const { start, pause, reset, seconds, minutes, hours } = useStopwatch({ autoStart: false });
    const { register, handleSubmit, formState: { errors }, reset: resetForm } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const disabledDetails = !isRunning && totalSeconds > 0;
    const startTimer = typeSelectedId !== null;

    const sessions = [
        { id: 1, topic: "Matemática", time: "1h 30m", date: "2023-10-01" },
        { id: 2, topic: "Física", time: "2h 00m", date: "2023-10-02" },
        { id: 3, topic: "Química", time: "1h 15m", date: "2023-10-03" },
    ];

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

    useEffect(() => {
        fetchCourses();
        fecthGoals();
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
        } catch (err) {
            console.error("Erro ao criar sessão de estudo: ", err);
        }
    }

    return (
        <main className="bg-zinc-200/10 min-h-screen">
            <Container>
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-bold text-2xl sm:text-3xl">Acompanhamento de Estudos</h1>
                        <span className="text-zinc-500 text-sm sm:text-base">
                            Registre suas sessões e acompanhe seu tempo de estudo
                        </span>
                    </div>
                </header>

                <div className="w-full min-h-full mt-8 sm:mt-12 flex flex-row lg:gap-8 gap-6">
                    <div className="flex flex-col flex-1 gap-4">
                        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-semibold">
                                    <LuClock size={24} className="text-blue-950" />
                                </div>
                                <h2 className="font-semibold text-lg">Cronômetro</h2>
                            </div>

                            <div className="text-center mt-8 bg-blue-300/30 rounded-full h-24 flex items-center justify-center">
                                <h3 className="text-6xl font-bold text-blue-950">{String(hours).padStart(2, "0")}:
                                    {String(minutes).padStart(2, "0")}:
                                    {String(seconds).padStart(2, "0")}</h3>
                            </div>

                            <div className="flex gap-4 mt-8 mb-6">
                                <button onClick={() => { setTypeSelected("Matéria"), setTypeSelectedId(null) }} className={`${typeSelected === "Matéria" ? "bg-blue-950 text-white" : ""} sm:mt-0 mt-2 flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-1.5 text-sm text-gray-600 cursor-pointer hover:bg-blue-950 hover:text-white transition-all duration-300`}>Matéria</button>
                                <button onClick={() => { setTypeSelected("Meta"), setTypeSelectedId(null) }} className={`${typeSelected === "Meta" ? "bg-blue-950 text-white" : ""} sm:mt-0 mt-2 flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-1.5 text-sm text-gray-600 cursor-pointer hover:bg-blue-950 hover:text-white transition-all duration-300`}>Meta</button>
                                {typeSelected === "Matéria" ? (
                                    <select
                                        className="rounded-lg border-2 border-gray-200 w-full outline-none px-3 py-2 bg-white"
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
                                        className="rounded-lg border-2 border-gray-200 w-full outline-none px-3 py-2 bg-white"
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

                            <div className="flex justify-center gap-2">
                                <Button
                                    width={`${startTimer ? '' : 'opacity-50 hover:cursor-default'}`}
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
                                    {isRunning ? <FiPause size={18} className="mr-2" /> : <FiPlay size={18} className="mr-2" />}
                                    {isRunning ? "Pausar" : "Iniciar"}
                                </Button>
                                <Button type="button" onClick={() => { reset(new Date(0), false); setIsRunning(false); }}>
                                    <FiRotateCcw size={18} className="mr-2" />
                                    Limpar
                                </Button>
                            </div>
                        </section>

                        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                            <h2 className="font-semibold text-lg mb-4">Detalhes da Sessão</h2>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Tópico</label>
                                    <Input
                                        type="text"
                                        name="topic"
                                        placeholder="Ex.: POO"
                                        register={register}
                                        error={errors.topic?.message}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="flex items-center text-gray-500 text-sm bg-blue-300/20 py-1 px-2 rounded-lg border border-blue-300/30">
                                        <input
                                            type="checkbox"
                                            {...register("revision")}
                                            className="mr-2"
                                        />
                                        <IoReload size={14} className="mr-1" />
                                        Está sessão é uma revisão
                                    </label>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Páginas Lidas</label>
                                        <Input
                                            type="number"
                                            name="pages"
                                            placeholder="0"
                                            register={register}
                                            error={errors.pages?.message}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Min de Vídeo Aula</label>
                                        <Input
                                            type="number"
                                            name="video"
                                            placeholder="0"
                                            register={register}
                                            error={errors.video?.message}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Total de Questões</label>
                                        <Input
                                            type="number"
                                            name="questions"
                                            placeholder="0"
                                            register={register}
                                            error={errors.questions?.message}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Questões Certas</label>
                                        <Input
                                            type="number"
                                            name="correctQuestions"
                                            placeholder="0"
                                            register={register}
                                            error={errors.correctQuestions?.message}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button width={`${disabledDetails ? '' : 'opacity-50 hover:cursor-default'}`} type="submit" disabled={!disabledDetails}>
                                        Salvar Sessão
                                    </Button>
                                    <button
                                        onClick={() => resetForm()}
                                        className="cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-red-600 hover:text-white text-red-600 px-4 py-1 flex justify-center items-center gap-2 bg-zinc-200/10 rounded-md border border-gray-200">
                                        Limpar campos
                                    </button>
                                </div>
                            </form>
                        </section>
                    </div>

                    <section className="flex flex-1 bg-white border border-gray-200 rounded-2xl py-6 shadow-lg">
                        <div className="w-full">
                            <h2 className="font-semibold text-lg mb-4 px-4">Sessões recentes</h2>
                            <div>
                                {sessions.map(session => (
                                    <div key={session.id} className="pb-2 border-y border-gray-200 py-2 w-full">
                                        <div className="flex items-center justify-between px-4 gap-2 w-full">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-blue-300/30 p-2 rounded-lg">
                                                    <LuBookOpen size={20} className="text-blue-950" />
                                                </div>
                                                <div>
                                                    <p><strong>{session.topic}</strong></p>
                                                    <span className="text-gray-500 text-sm">Soma</span>
                                                    <p className="text-gray-500 text-sm flex items-center">
                                                        <CiViewList size={14} className="mr-1" /> 15 páginas
                                                        <CiVideoOn size={14} className="ml-2 mr-1" /> 45 min vídeo
                                                        <CiCircleQuestion size={14} className="ml-2 mr-1" /> 8/10 questões
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-lg">{session.time}</p>
                                                <p className="text-sm text-gray-500">03 de fev.</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </Container>
        </main>
    )
}
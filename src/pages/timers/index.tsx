import { Container } from "../../components/container";
import { Button } from "../../components/ui/Button";
import { FiPlay, FiPause, FiRotateCcw } from "react-icons/fi";
import { useState } from "react";
import { useStopwatch } from "react-timer-hook"
import { LuBookOpen, LuClock } from "react-icons/lu";
import { CiCircleQuestion, CiVideoOn, CiViewList } from "react-icons/ci";
import { IoReload } from "react-icons/io5";

export function Timers() {
    const { start, pause, reset, seconds, minutes, hours } = useStopwatch({ autoStart: false });
    const [isRunning, setIsRunning] = useState(false);
    const [topic, setTopic] = useState("");
    const [isReview, setIsReview] = useState(false);
    const [pagesRead, setPagesRead] = useState("");
    const [videoMinutes, setVideoMinutes] = useState("");
    const [totalQuestions, setTotalQuestions] = useState("");
    const [correctQuestions, setCorrectQuestions] = useState("");
    const [typeSelected, setTypeSelected] = useState<"Matéria" | "Meta">("Matéria");

    const sessions = [
        { id: 1, topic: "Matemática", time: "1h 30m", date: "2023-10-01" },
        { id: 2, topic: "Física", time: "2h 00m", date: "2023-10-02" },
        { id: 3, topic: "Química", time: "1h 15m", date: "2023-10-03" },
    ];

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
                                <button onClick={() => setTypeSelected("Matéria")} className={`${typeSelected === "Matéria" ? "bg-blue-950 text-white" : ""} sm:mt-0 mt-2 flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-1.5 text-sm text-gray-600 cursor-pointer hover:bg-blue-950 hover:text-white transition-all duration-300`}>Matéria</button>
                                <button onClick={() => setTypeSelected("Meta")} className={`${typeSelected === "Meta" ? "bg-blue-950 text-white" : ""} sm:mt-0 mt-2 flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-1.5 text-sm text-gray-600 cursor-pointer hover:bg-blue-950 hover:text-white transition-all duration-300`}>Meta</button>
                                {typeSelected === "Matéria" ? (
                                    <select className="rounded-lg border-2 border-gray-200 w-full outline-none px-3 py-2 bg-white" >
                                        <option value="">Selecione uma matéria</option>
                                    </select>
                                ) : (
                                    <select className="rounded-lg border-2 border-gray-200 w-full outline-none px-3 py-2 bg-white" >
                                        <option value="">Selecione uma meta</option>
                                    </select>
                                )}
                            </div>

                            <div className="flex justify-center gap-2">
                                <Button
                                    type="button"
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
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Tópico</label>
                                <input
                                    className="h-10 rounded-lg border-2 border-gray-200 w-full outline-none px-2"
                                    type="text"
                                    placeholder="Tópico estudado"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="flex items-center text-gray-500 text-sm bg-blue-300/20 py-1 px-2 rounded-lg border border-blue-300/30">
                                    <input
                                        type="checkbox"
                                        checked={isReview}
                                        onChange={(e) => setIsReview(e.target.checked)}
                                        className="mr-2"
                                    />
                                    <IoReload size={14} className="mr-1" />
                                    Está sessão é uma revisão
                                </label>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Páginas Lidas</label>
                                    <input
                                        className="h-10 rounded-lg border-2 border-gray-200 w-full outline-none px-2"
                                        type="number"
                                        placeholder="0"
                                        value={pagesRead}
                                        onChange={(e) => setPagesRead(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Min de Vídeo Aula</label>
                                    <input
                                        className="h-10 rounded-lg border-2 border-gray-200 w-full outline-none px-2"
                                        type="number"
                                        placeholder="0"
                                        value={videoMinutes}
                                        onChange={(e) => setVideoMinutes(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Total de Questões</label>
                                    <input
                                        className="h-10 rounded-lg border-2 border-gray-200 w-full outline-none px-2"
                                        type="number"
                                        placeholder="0"
                                        value={totalQuestions}
                                        onChange={(e) => setTotalQuestions(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Questões Certas</label>
                                    <input
                                        className="h-10 rounded-lg border-2 border-gray-200 w-full outline-none px-2"
                                        type="number"
                                        placeholder="0"
                                        value={correctQuestions}
                                        onChange={(e) => setCorrectQuestions(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="button">Salvar Sessão</Button>
                                <button
                                    className="cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-red-600 hover:text-white text-red-600 px-4 py-1 flex justify-center items-center gap-2 bg-zinc-200/10 rounded-md border border-gray-200">
                                    Limpar campos
                                </button>
                            </div>
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
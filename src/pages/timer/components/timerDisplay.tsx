import { LuClock } from "react-icons/lu";
import { Button } from "../../../components/ui/Button";
import type { CourseProps, GoalsProps } from "../types/timerTypes";
import { FiPause, FiPlay, FiRotateCcw } from "react-icons/fi";

interface TimerDisplayProps {
    hours: number;
    minutes: number;
    seconds: number;
    isCourse: boolean;
    setIsCourse: (type: boolean) => void;
    typeSelectedId: string | null;
    setTypeSelectedId: (id: string | null) => void;
    courseList: CourseProps[];
    goalList: GoalsProps[];
    isRunning: boolean;
    setIsRunning: (isRunning: boolean) => void;
    startTimerFunction: () => void;
    reset: (time: Date, autoStart: boolean) => void;
}

export function TimerDisplay({
    hours,
    minutes,
    seconds,
    isCourse,
    setIsCourse,
    typeSelectedId,
    setTypeSelectedId,
    courseList,
    goalList,
    isRunning,
    setIsRunning,
    startTimerFunction,
    reset
}: TimerDisplayProps) {

    const startTimer = typeSelectedId !== null;

    function formatTime(value: number) {
        return String(value).padStart(2, "0");
    }

    return (
        <section className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center gap-2">
                <div className="flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-blue-100 text-blue-600 font-semibold shrink-0">
                    <LuClock size={18} className="sm:w-6 sm:h-6 text-blue-950" />
                </div>
                <h2 className="font-semibold text-base sm:text-lg">Cronômetro</h2>
            </div>

            <div className="text-center mt-6 sm:mt-8 bg-blue-300/30 rounded-full h-20 sm:h-24 md:h-28 flex items-center justify-center">
                <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-950">{formatTime(hours)}:
                    {formatTime(minutes)}:
                    {formatTime(seconds)}</h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-6 sm:mt-8 mb-4 sm:mb-6">
                <button onClick={() => { setIsCourse(true), setTypeSelectedId(null) }} className={`${isCourse ? "bg-blue-950 text-white" : ""} w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 sm:px-4 py-2 sm:py-1.5 text-xs sm:text-sm text-gray-600 cursor-pointer hover:bg-blue-950 hover:text-white transition-all duration-300`}>Matéria</button>
                <button onClick={() => { setIsCourse(false), setTypeSelectedId(null) }} className={`${!isCourse ? "bg-blue-950 text-white" : ""} w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 sm:px-4 py-2 sm:py-1.5 text-xs sm:text-sm text-gray-600 cursor-pointer hover:bg-blue-950 hover:text-white transition-all duration-300`}>Meta</button>
                {isCourse ? (
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
                    onClick={startTimerFunction}
                >
                    {isRunning ? <FiPause size={16} className="mr-1 sm:mr-2" /> : <FiPlay size={16} className="mr-1 sm:mr-2" />}
                    {isRunning ? "Pausar" : "Iniciar"}
                </Button>
                <Button
                    type="button"
                    width={`w-full sm:w-auto ${isRunning ? 'opacity-50 hover:cursor-default' : ''}`}
                    disabled={isRunning}
                    onClick={() => { reset(new Date(0), false); setIsRunning(false); }}>
                    <FiRotateCcw size={16} className="mr-1 sm:mr-2" />
                    Limpar
                </Button>
            </div>
        </section>
    )
}
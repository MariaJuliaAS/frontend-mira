import { Container } from "../../components/container";
import { useState } from "react";
import { useStopwatch } from "react-timer-hook"
import { HeaderPages } from "../../components/ui/HeaderPages";
import { TimerDisplay } from "./components/timerDisplay";
import { useTimer } from "./hooks/useTimer";
import { useCourse } from "../courses/hooks/useCourse";
import { useGoals } from "../goals/hooks/useGoals";
import { DetailSessionForm } from "./components/detailSessionForms";
import { SessionsList } from "./components/sessionsList";
import type { CreateTimerDTO } from "./types/timerTypes";

export function Timers() {
    const [isRunning, setIsRunning] = useState(false);
    const [typeSelectedId, setTypeSelectedId] = useState<string | null>(null);
    const [isCourse, setIsCourse] = useState(true);

    const { start, pause, reset, seconds, minutes, hours } = useStopwatch({ autoStart: false });

    const { createSession, deleteSession, sessionsList } = useTimer();
    const { courses } = useCourse();
    const { goals } = useGoals();

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const disabledDetails = !isRunning && totalSeconds > 0;

    function startTimerFunction() {
        if (isRunning) {
            pause();
            setIsRunning(false);
        } else {
            start();
            setIsRunning(true);
        }
    }

    async function handleCreateSession(
        data: CreateTimerDTO,
        totalSeconds: number,
        isCourse: boolean,
        typeSelectedId: string | null
    ) {
        if (!typeSelectedId) {
            console.error("No course or goal selected");
            return;
        }
        await createSession(data, totalSeconds, typeSelectedId, isCourse);
        reset(new Date(), false);
        setIsRunning(false);
        setIsCourse(true);
    }

    return (
        <main className="bg-zinc-200/10 min-h-screen">
            <Container>
                <HeaderPages
                    title="Cronômetro"
                    subTitle="Registre suas sessões e acompanhe seu tempo de estudo"
                ></HeaderPages>

                <div className="w-full min-h-full mt-6 sm:mt-8 md:mt-12 flex flex-col lg:flex-row lg:gap-8 gap-4 px-2 sm:px-0">
                    <div className="flex flex-col flex-1 gap-4">
                        <TimerDisplay
                            hours={hours}
                            seconds={seconds}
                            minutes={minutes}
                            isCourse={isCourse}
                            setIsCourse={setIsCourse}
                            typeSelectedId={typeSelectedId}
                            setTypeSelectedId={setTypeSelectedId}
                            courseList={courses}
                            goalList={goals}
                            isRunning={isRunning}
                            setIsRunning={setIsRunning}
                            startTimerFunction={startTimerFunction}
                            reset={reset}
                        />

                        <DetailSessionForm
                            onSubmit={handleCreateSession}
                            disabledDetails={disabledDetails}
                            totalSeconds={totalSeconds}
                            typeSelectedId={typeSelectedId}
                            isCourse={isCourse}
                        />
                    </div>

                    <SessionsList
                        sessionsList={sessionsList}
                        onDeleteSession={deleteSession}
                    />
                </div>
            </Container>
        </main>
    )
}
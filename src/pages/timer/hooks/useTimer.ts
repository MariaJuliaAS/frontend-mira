import { useEffect, useState } from "react";
import { timerService } from "../services/timerService";
import type { CreateTimerDTO, SessionProps } from "../types/timerTypes";

export function useTimer() {
    const [sessionsList, setSessionsList] = useState<SessionProps[]>([]);

    async function fetchSessions() {
        try {
            const data = await timerService.getAll();
            setSessionsList(data);
        } catch (error) {
            console.error("Error fetching sessions: ", error);
        }
    }

    async function createSession(data: CreateTimerDTO, totalSeconds: number, typeSelectedId: string, isCourse: boolean) {
        try {
            if (isCourse) {
                const response = await timerService.createByCourse(data, totalSeconds, typeSelectedId);
                setSessionsList(prev => [...prev, response]);
            } else {
                const response = await timerService.createByGoal(data, totalSeconds, typeSelectedId);
                setSessionsList(prev => [...prev, response]);
            }
        } catch (error) {
            console.error("Error creating session: ", error);
        }
    }

    async function deleteSession(sessionId: string) {
        try {
            await timerService.delete(sessionId);
            setSessionsList(prevSessions => prevSessions.filter(session => session.id !== sessionId));
        } catch (error) {
            console.error("Error deleting session: ", error);
        }
    }

    useEffect(() => {
        fetchSessions();
    })

    return {
        fetchSessions,
        createSession,
        deleteSession,
        sessionsList
    }

}
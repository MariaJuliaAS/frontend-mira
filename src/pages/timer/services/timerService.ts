import { api } from "../../../service/api";
import type { CreateTimerDTO } from "../types/timerTypes";

function getAuthHeader() {
    const token = localStorage.getItem('@tokenMira');

    if (!token) {
        throw new Error('Token not found');
    }

    return {
        Authorization: `Bearer ${token}`
    }
}

export const timerService = {
    async getAll() {
        const response = await api.get("/timers", {
            headers: getAuthHeader()
        })
        return response.data;
    },

    async createByCourse(data: CreateTimerDTO, totalSeconds: number, typeSelectedId: string) {
        const pages = data.pages ? parseInt(data.pages) : 0;
        const video = data.video ? parseInt(data.video) : 0;
        const questions = data.questions ? parseInt(data.questions) : 0;
        const correctQuestions = data.correctQuestions ? parseInt(data.correctQuestions) : 0;

        const response = await api.post(`/timer/courses/${typeSelectedId}`, {
            topic: data.topic,
            time: totalSeconds,
            pages,
            video,
            questions,
            correctQuestions,
            revision: data.revision || false
        }, {
            headers: getAuthHeader()
        })
        return response.data;
    },

    async createByGoal(data: CreateTimerDTO, totalSeconds: number, typeSelectedId: string) {
        const pages = data.pages ? parseInt(data.pages) : 0;
        const video = data.video ? parseInt(data.video) : 0;
        const questions = data.questions ? parseInt(data.questions) : 0;
        const correctQuestions = data.correctQuestions ? parseInt(data.correctQuestions) : 0;

        const response = await api.post(`/timer/goals/${typeSelectedId}`, {
            topic: data.topic,
            time: totalSeconds,
            pages,
            video,
            questions,
            correctQuestions,
            revision: data.revision || false
        }, {
            headers: getAuthHeader()
        })
        return response.data;
    },

    async delete(id: string) {
        await api.delete(`/timer/${id}`, {
            headers: getAuthHeader()
        })
    }
}
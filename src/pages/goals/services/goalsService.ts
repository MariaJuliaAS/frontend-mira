import { api } from "../../../service/api";
import type { CreateGoalDTO, GoalsProps, UpdateGoalTopicDTO, CreateGoalTopicDTO } from "../types/goalsTypes";

function getAuthHeader() {
    const token = localStorage.getItem('@tokenMira');

    if (!token) {
        throw new Error('Token not found');
    }

    return {
        Authorization: `Bearer ${token}`
    }
}

export const goalsService = {
    async getAll(): Promise<GoalsProps[]> {
        const response = await api.get("/goal", {
            headers: getAuthHeader()
        })
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/goal/${id}`, {
            headers: getAuthHeader()
        })
    },

    async create(data: CreateGoalDTO): Promise<GoalsProps> {
        if (data.course_id) {
            const response = await api.post(`/goal/courses/${data.course_id}`, data, {
                headers: getAuthHeader()
            })
            return response.data;
        }

        const response = await api.post("/goal", data, {
            headers: getAuthHeader()
        })
        return response.data;
    },

    async updateTopic(id: string, data: UpdateGoalTopicDTO): Promise<void> {
        await api.put(`/goal/topic/${id}`, data, {
            headers: getAuthHeader()
        })
    },

    async deleteTopic(id: string): Promise<void> {
        await api.delete(`/goal/topic/${id}`, {
            headers: getAuthHeader()
        })
    },

    async createTopic(goalId: string, data: CreateGoalTopicDTO): Promise<void> {
        await api.post(`/goal/topic/${goalId}`, data, {
            headers: getAuthHeader()
        })
    }
}

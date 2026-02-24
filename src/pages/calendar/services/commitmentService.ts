import { format } from "date-fns";
import { api } from "../../../service/api";
import type { CreateCommitmentDTO } from "../types/calendarTypes";
import { ptBR } from "date-fns/locale";

function getAuthHeader() {
    const token = localStorage.getItem('@tokenMira');

    if (!token) {
        throw new Error('Token not found');
    }

    return {
        Authorization: `Bearer ${token}`
    }
}

export const commitmentService = {
    async getAll() {
        const response = await api.get("/commitment/all", {
            headers: getAuthHeader()
        })
        return response.data;
    },

    async delete(id: string) {
        await api.delete(`/commitment/${id}`, {
            headers: getAuthHeader()
        })
    },

    async create(data: CreateCommitmentDTO) {
        const response = await api.post("/commitment",
            {
                name: data.name,
                date: data.date,
                type: data.type,
                description: data.description,
                course_id: data.course_id
            },
            {
                headers: getAuthHeader()
            }
        )
        return response.data;
    }
}
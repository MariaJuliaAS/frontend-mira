import { api } from "../../../service/api";
import type { CreateCourseDTO } from "../types/courseTypes";


function getAuthHeader() {
    const token = localStorage.getItem('@tokenMira');

    if (!token) {
        throw new Error('Token not found');
    }

    return {
        Authorization: `Bearer ${token}`
    }
}

export const courseService = {
    async getAll() {
        const response = await api.get("/course/all", {
            headers: getAuthHeader()
        })
        return response.data;
    },

    async delete(id: string) {
        await api.delete(`/course/${id}`, {
            headers: getAuthHeader()
        })
    },

    async create(data: CreateCourseDTO) {
        const response = await api.post("/course", {
            name: data.name,
            teacher: data.teacher
        }, {
            headers: getAuthHeader()
        })
        return response.data;
    },

    async edit(data: CreateCourseDTO, id: string) {
        await api.put(`/course/${id}`, {
            name: data.name,
            teacher: data.teacher
        },
            {
                headers: getAuthHeader()
            })
    }
}
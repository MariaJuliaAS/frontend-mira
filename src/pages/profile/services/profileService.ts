import { api } from "../../../service/api";
import type { UserDetailProps, UserStatsProps, UpdateProfileDTO } from "../types/profileTypes";

function getAuthHeader() {
    const token = localStorage.getItem('@tokenMira');

    if (!token) {
        throw new Error('Token not found');
    }

    return {
        Authorization: `Bearer ${token}`
    }
}

export const profileService = {
    async getUserDetail(): Promise<UserDetailProps> {
        const response = await api.get("/user/me", {
            headers: getAuthHeader()
        })
        return response.data;
    },

    async getUserStats(): Promise<UserStatsProps> {
        const response = await api.get("/user/stats", {
            headers: getAuthHeader()
        })
        return response.data;
    },

    async updateProfile(profileId: string, data: UpdateProfileDTO): Promise<void> {
        await api.put(`/profile/${profileId}`, {
            university: data.university,
            program: data.program,
            period: data.period ? Number(data.period) : undefined
        }, {
            headers: getAuthHeader()
        })
    },

    async createProfile(data: UpdateProfileDTO): Promise<void> {
        await api.post("/profile", {
            university: data.university,
            program: data.program,
            period: data.period ? Number(data.period) : undefined
        }, {
            headers: getAuthHeader()
        })
    }
}

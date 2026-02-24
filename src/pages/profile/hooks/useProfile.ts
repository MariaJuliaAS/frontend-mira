import { useEffect, useState } from "react";
import type { UserDetailProps, UserStatsProps, UpdateProfileDTO } from "../types/profileTypes";
import { profileService } from "../services/profileService";
import toast from "react-hot-toast";

export function useProfile() {
    const [userDetail, setUserDetail] = useState<UserDetailProps>();
    const [userStats, setUserStats] = useState<UserStatsProps>();
    const [isLoading, setIsLoading] = useState(true);

    async function fetchUserDetail() {
        try {
            const data = await profileService.getUserDetail();
            setUserDetail(data);
        } catch (error) {
            console.error("Error fetching user detail:", error);
        }
    }

    async function fetchUserStats() {
        try {
            const data = await profileService.getUserStats();
            setUserStats(data);
        } catch (error) {
            console.error("Error fetching user stats:", error);
        }
    }

    async function updateProfile(data: UpdateProfileDTO) {
        try {
            const profileId = userDetail?.profiles?.id;
            if (!profileId) {
                throw new Error("Profile ID not found");
            }

            await profileService.updateProfile(profileId, data);
            toast.success("Perfil atualizado com sucesso!");
            await fetchUserDetail();
            return true;
        } catch (error) {
            console.error("Error updating profile:", error);
            return false;
        }
    }

    async function createProfile(data: UpdateProfileDTO) {
        try {
            await profileService.createProfile(data);
            toast.success("Informações adicionadas com sucesso!");
            await fetchUserDetail();
            return true;
        } catch (error) {
            console.error("Error creating profile:", error);
            return false;
        }
    }

    async function fetchData() {
        setIsLoading(true);
        await Promise.all([fetchUserDetail(), fetchUserStats()]);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [])

    return {
        userDetail,
        userStats,
        isLoading,
        updateProfile,
        createProfile,
        refresh: fetchData
    }
}

import { useEffect, useState } from "react";
import type { GoalsProps } from "../../goals/types/goalsTypes";
import type { CommitmentsProps } from "../../calendar/types/calendarTypes";
import type { UserStatsProps } from "../../profile/types/profileTypes";
import { goalsService } from "../../goals/services/goalsService";
import { commitmentService } from "../../calendar/services/commitmentService";
import { profileService } from "../../profile/services/profileService";

export function useDashboard() {
    const [goals, setGoals] = useState<GoalsProps[]>([]);
    const [commitments, setCommitments] = useState<CommitmentsProps[]>([]);
    const [userStats, setUserStats] = useState<UserStatsProps>();
    const [isLoading, setIsLoading] = useState(true);

    async function fetchGoals() {
        try {
            const data = await goalsService.getAll();
            setGoals(data);
        } catch (error) {
            console.error("Error fetching goals:", error);
        }
    }

    async function fetchCommitments() {
        try {
            const data = await commitmentService.getAll();
            setCommitments(data);
        } catch (error) {
            console.error("Error fetching commitments:", error);
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

    async function fetchAllData() {
        setIsLoading(true);
        await Promise.all([
            fetchGoals(),
            fetchCommitments(),
            fetchUserStats()
        ]);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchAllData();
    }, []);

    return {
        goals,
        commitments,
        userStats,
        isLoading,
        refresh: fetchAllData
    };
}

import { useEffect, useState } from "react";
import type { GoalsProps, CreateGoalDTO } from "../types/goalsTypes";
import { goalsService } from "../services/goalsService";
import toast from "react-hot-toast";

export function useGoals() {
    const [goals, setGoals] = useState<GoalsProps[]>([]);
    const [selectedGoal, setSelectedGoal] = useState<GoalsProps | null>(null);

    async function fetchGoals() {
        try {
            const data: GoalsProps[] = await goalsService.getAll();
            setGoals(data);
            if (data.length > 0) {
                setSelectedGoal(data[0]);
            }
        } catch (error) {
            console.error("Error fetching goals:", error);
        }
    }

    async function deleteGoal(id: string) {
        try {
            await goalsService.delete(id);
            const updatedGoals = goals.filter(goal => goal.id !== id);
            setGoals(updatedGoals);

            if (selectedGoal?.id === id) {
                setSelectedGoal(updatedGoals[0] || null);
            }

            toast.success("Meta deletada com sucesso!");
        } catch (error) {
            console.error("Error deleting goal:", error);
        }
    }

    async function toggleTopicCompletion(topicId: string) {
        if (!selectedGoal) return;

        try {
            const topic = selectedGoal.goalsTopcis?.find(t => t.id === topicId);
            const isCompleted = !topic?.completed;

            await goalsService.updateTopic(topicId, { completed: isCompleted });

            const updatedTopics = selectedGoal.goalsTopcis?.map(t =>
                t.id === topicId ? { ...t, completed: isCompleted } : t
            ) || [];

            const updatedGoal = {
                ...selectedGoal,
                goalsTopcis: updatedTopics
            };

            setSelectedGoal(updatedGoal);
            setGoals(goals.map(g => g.id === selectedGoal.id ? updatedGoal : g));
        } catch (error) {
            console.error("Error updating topic:", error);
        }
    }

    async function deleteGoalTopic(topicId: string) {
        if (!selectedGoal) return;

        try {
            await goalsService.deleteTopic(topicId);

            const updatedTopics = selectedGoal.goalsTopcis?.filter(t => t.id !== topicId) || [];
            const updatedGoal = {
                ...selectedGoal,
                goalsTopcis: updatedTopics
            };

            setSelectedGoal(updatedGoal);
            setGoals(goals.map(g => g.id === selectedGoal.id ? updatedGoal : g));

            toast.success("Tópico deletado com sucesso!");
        } catch (error) {
            console.error("Error deleting topic:", error);
        }
    }

    async function addGoalTopic(topicName: string) {
        if (!selectedGoal || !topicName.trim()) return;

        try {
            await goalsService.createTopic(selectedGoal.id, { name: topicName });
            toast.success("Tópico adicionado com sucesso!");
            await fetchGoals();
        } catch (error) {
            console.error("Error adding topic:", error);
        }
    }

    async function createGoal(data: CreateGoalDTO): Promise<void> {
        try {
            await goalsService.create(data);
            await fetchGoals();
        } catch (error) {
            console.error("Error creating goal:", error);
            throw error;
        }
    }

    useEffect(() => {
        fetchGoals();
    }, [])

    return {
        goals,
        selectedGoal,
        setSelectedGoal,
        deleteGoal,
        toggleTopicCompletion,
        deleteGoalTopic,
        addGoalTopic,
        createGoal,
        refresh: fetchGoals
    }
}

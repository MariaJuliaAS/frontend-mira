import { useEffect, useState } from "react";
import type { CommitmentsProps, CreateCommitmentDTO } from "../types/calendarTypes";
import { commitmentService } from "../services/commitmentService";

export function useCommitment() {
    const [commitments, setCommitments] = useState<CommitmentsProps[]>([]);

    async function fetchCommitments() {
        try {
            const data = await commitmentService.getAll();
            setCommitments(data);
        } catch (error) {
            console.error("Error fetching commitments:", error);
        }
    }

    async function deleteCommitment(id: string) {
        try {
            await commitmentService.delete(id);
            setCommitments(prev => prev.filter(commitment => commitment.id !== id));
            alert("Compromisso deletado com sucesso");
        } catch (error) {
            console.error("Error deleting commitment:", error);
        }
    }

    async function createCommitment(data: CreateCommitmentDTO) {
        try {
            const response = await commitmentService.create(data);
            setCommitments(prev => [...prev, response]);
            alert("Compromisso criado com sucesso");
        } catch (error) {
            console.error("Error creating commitment:", error);
        }
    }

    useEffect(() => {
        fetchCommitments();
    }, [])

    return {
        refresh: fetchCommitments,
        commitments,
        deleteCommitment,
        createCommitment
    }
}
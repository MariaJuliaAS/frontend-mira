export interface CreateTimerDTO {
    topic: string;
    pages?: string;
    questions?: string;
    correctQuestions?: string;
    video?: string;
    revision?: boolean;
}

export interface CourseProps {
    id: string;
    name: string;
}

export interface GoalsProps {
    id: string;
    name: string;
}

export interface SessionProps {
    id: string;
    time: number;
    topic: string;
    pages: number;
    questions: number;
    correctQuestions: number;
    video: number;
    revision: boolean;
    created_at: string;
    course?: CourseProps;
    goal?: GoalsProps;
}

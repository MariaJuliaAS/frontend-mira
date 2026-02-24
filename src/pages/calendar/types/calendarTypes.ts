
export interface CommitmentsProps {
    id: string;
    name: string;
    date: Date;
    type: CommitmentType;
    description?: string;
    course?: CourseProps;
}

export interface CourseProps {
    id: string;
    name: string;
    teacher?: string;
}

export type CommitmentType =
    | "Prova"
    | "Trabalho"
    | "Atividade"
    | "Evento"
    | "Outro";

export interface CalendarContextData {
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    commitmentSelected?: CommitmentsProps;
    setCommitmentSelected: (commitment?: CommitmentsProps) => void;
}

export interface CreateCommitmentDTO {
    name: string;
    date: Date;
    type?: string;
    course_id?: string;
    description?: string;
}
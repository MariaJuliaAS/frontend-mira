export interface ProfileProps {
    id: string;
    university?: string;
    period?: number;
    program?: string;
}

export interface UserDetailProps {
    id: string;
    name: string;
    email: string;
    profiles?: ProfileProps;
}

export interface UserStatsProps {
    totalStudyTime: {
        time: number;
    };
    activeGoals: number;
    activeCourses: number;
}

export interface UpdateProfileDTO {
    university?: string;
    period?: number;
    program?: string;
}

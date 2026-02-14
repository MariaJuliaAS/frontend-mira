export interface CreateCourseDTO {
    name: string;
    teacher?: string;
}

export interface CourseProps {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    teacher?: string;
    user_id: string;
    goals: {
        course_id: string;
    }[];
    commitments: {
        type: string;
    }[];
    timers: {
        course_id: string;
    }[];
}

export type CourseModalModel = "create" | "edit";
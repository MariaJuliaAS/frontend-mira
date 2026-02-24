export interface GoalTopicProps {
    id: string;
    name: string;
    completed?: boolean;
}

export interface CourseProps {
    id: string;
    name: string;
}

export interface GoalsProps {
    id: string;
    name: string;
    description: string;
    end_date: string;
    course?: CourseProps;
    goalsTopcis?: GoalTopicProps[];
}

export interface CreateGoalDTO {
    name: string;
    description?: string;
    end_date: Date;
    course_id?: string;
}

export interface CreateGoalTopicDTO {
    name: string;
}

export interface UpdateGoalTopicDTO {
    completed: boolean;
}
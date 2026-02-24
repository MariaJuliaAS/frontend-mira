import { useEffect, useState } from "react";
import type { CourseProps, CreateCourseDTO } from "../types/courseTypes";
import { courseService } from "../services/courseService";
import toast from "react-hot-toast";


export function useCourse() {
    const [courses, setCourses] = useState<CourseProps[]>([]);

    async function fetchCourses() {
        try {
            const data = await courseService.getAll();
            setCourses(data);
        } catch (error) {
            console.error("Error fetching courses: ", error);
        }
    }

    async function deleteCourse(id: string) {
        try {
            await courseService.delete(id);
            setCourses(prev => prev.filter(course => course.id !== id));
            toast.success("Curso deletado com sucesso!");
        } catch (error) {
            console.error("Error deleting course: ", error);
        }
    }

    async function createCourse(data: CreateCourseDTO) {
        try {
            const response = await courseService.create(data);
            setCourses(prev => [...prev, response]);
            toast.success("Curso criado com sucesso!");
        } catch (error) {
            console.error("Error creating course: ", error);
        }
    }

    async function editCourse(data: CreateCourseDTO, id: string) {
        try {
            await courseService.edit(data, id);
            setCourses(prev => prev.map(course => course.id === id ? { ...course, name: data.name, teacher: data.teacher } : course));
            toast.success("Curso editado com sucesso!");
        } catch (error) {
            console.error("Error editing course: ", error);
        }
    }

    useEffect(() => {
        fetchCourses();
    }, [])

    return {
        refresh: fetchCourses,
        courses,
        deleteCourse,
        createCourse,
        editCourse
    }
}
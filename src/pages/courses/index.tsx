import { Container } from "../../components/container";
import { FiPlus } from "react-icons/fi";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { CourseModal } from "./modals/courseModal";
import { ConfirmDelete } from "../../components/modals/confirmDelete";
import { HeaderPages } from "../../components/ui/HeaderPages";
import { CoursesCards } from "./components/coursesCards";
import { useCourse } from "./hooks/useCourse";
import type { CourseProps } from "./types/courseTypes";

export function Courses() {
    const [createModalIsOpen, setCreateModalIsOpen] = useState<boolean>(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
    const [modalConfirmDelete, setModalConfirmDelete] = useState<boolean>(false);
    const [selectedCourse, setSelectedCourse] = useState<CourseProps | null>();

    const { refresh, deleteCourse, courses } = useCourse();

    return (
        <main className="bg-zinc-200/10 min-h-screen">
            <Container>

                <HeaderPages
                    title="Matérias"
                    subTitle="Gerencie suas matérias"
                >
                    <Button
                        type="button"
                        onClick={() => setCreateModalIsOpen(true)}
                    >
                        <FiPlus size={18} className="mr-2" />
                        Nova Matéria
                    </Button>
                </HeaderPages>

                <CoursesCards
                    courseList={courses}
                    onEdit={(course) => {
                        setSelectedCourse(course);
                        setEditModalIsOpen(true);
                    }}
                    onDelete={(course) => {
                        setSelectedCourse(course);
                        setModalConfirmDelete(true);
                    }}
                    refresh={refresh}
                />

            </Container>

            {createModalIsOpen && <CourseModal closeModal={() => setCreateModalIsOpen(false)} mode="create" />}
            {editModalIsOpen && <CourseModal closeModal={() => setEditModalIsOpen(false)} mode="edit" course={selectedCourse} />}
            {modalConfirmDelete && <ConfirmDelete closeModal={() => setModalConfirmDelete(false)} deleteCourse={deleteCourse} course={selectedCourse} />}

        </main>

    )
}
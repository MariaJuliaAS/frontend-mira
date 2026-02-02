import { Container } from "../../components/container";
import { SlGraduation } from "react-icons/sl";
import { CiViewList } from "react-icons/ci";
import { LiaClipboardListSolid } from "react-icons/lia";
import { LuBookOpen, LuTarget } from "react-icons/lu";
import { FiPlus } from "react-icons/fi";
import { BsCalendar3 } from "react-icons/bs";
import { GoClock, GoTrash, GoPencil } from "react-icons/go";
import { useEffect, useState } from "react";
import { api } from "../../service/api";
import { Button } from "../../components/ui/Button";
import { CourseModal } from "../../components/modals/courseModal";
import { ConfirmDelete } from "../../components/modals/confirmDelete";

export interface CourseProps {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    teacher?: string;
    user_id: string;
    goals: GoalProps[];
    commitments: CommitmentProps[];
    timers: TimerProps[];
}

interface GoalProps {
    course_id: string;
}

interface CommitmentProps {
    type: string;
}

interface TimerProps {
    course_id: string;
}

export function Courses() {
    const [courseList, setCourseList] = useState<CourseProps[]>([]);
    const [createModalIsOpen, setCreateModalIsOpen] = useState<boolean>(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
    const [modalConfirmDelete, setModalConfirmDelete] = useState<boolean>(false);
    const [selectedCourse, setSelectedCourse] = useState<CourseProps | null>();

    async function fetchCourses() {
        const token = localStorage.getItem("@tokenMira");

        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const response = await api.get("/course/all", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setCourseList(response.data);
        } catch (err) {
            console.error("Error fetching courses", err);
        }
    }

    useEffect(() => {
        fetchCourses();
    }, [])

    async function deleteCourse(id: string) {
        const token = localStorage.getItem("@tokenMira");

        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            await api.delete(`/course/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const updateCourses = courseList.filter(c => c.id !== id)
            setCourseList(updateCourses);

            alert("Curso deletado com sucesso");
        } catch (error) {
            console.error("Erro ao deletar curso: ", error)
        }
    }

    return (
        <main className="bg-zinc-200/10 min-h-screen">
            <Container>

                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-bold text-2xl sm:text-3xl">Matérias</h1>
                        <span className="text-zinc-500 text-sm sm:text-base">
                            Gerencie suas matérias
                        </span>
                    </div>

                    <Button
                        type="button"
                        onClick={() => setCreateModalIsOpen(true)}
                    >
                        <FiPlus size={18} className="mr-2" />
                        Nova Matéria
                    </Button>
                </header>

                {courseList.length == 0 ? (
                    <div className="flex justify-center mt-12 text-center sm:px-0 px-4">
                        <h1>Nenhuma matéria cadastrada, clique em criar nova matéria.</h1>
                    </div>
                ) : (
                    <section className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
                        {courseList.map((course) => (
                            <div
                                key={course.id}
                                className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-lg hover:border-blue-800/40 transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-800/40 p-3 rounded-xl shrink-0">
                                        <LuBookOpen size={20} className="text-blue-950" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="font-semibold text-base sm:text-lg text-black truncate">
                                            {course.name}
                                        </p>
                                        <span className="text-zinc-500 text-xs sm:text-sm">
                                            {course.teacher
                                                ? `Prof. ${course.teacher}`
                                                : "Sem professor cadastrado"}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <div className="grid grid-cols-2 gap-3 text-zinc-400 text-xs sm:text-sm my-5">
                                        <p className="flex items-center gap-2">
                                            <SlGraduation size={14} />
                                            {course.commitments.filter(c => c.type == "PROVA").length}
                                            {course.commitments.filter(c => c.type == "PROVA").length == 1 ? " prova" : " provas"}
                                        </p>

                                        <p className="flex items-center gap-2">
                                            <LiaClipboardListSolid size={14} />
                                            {course.commitments.filter(c => c.type == "TRABALHO").length}
                                            {course.commitments.filter(c => c.type == "TRABALHO").length == 1 ? " trabalho" : " trabalhos"}
                                        </p>

                                        <p className="flex items-center gap-2">
                                            <CiViewList size={14} />
                                            {course.commitments.filter(c => c.type == "ATIVIDADE").length}
                                            {course.commitments.filter(c => c.type == "ATIVIDADE").length == 1 ? " atividade" : " atividades"}
                                        </p>

                                        <p className="flex items-center gap-2">
                                            <BsCalendar3 size={14} />
                                            {course.commitments.filter(c => c.type == "EVENTO").length}
                                            {course.commitments.filter(c => c.type == "EVENTO").length == 1 ? " evento" : " eventos"}
                                        </p>

                                        <p className="flex items-center gap-2">
                                            <LuTarget size={14} />
                                            {course.goals.filter(c => c.course_id != null).length}
                                            {course.goals.filter(c => c.course_id != null).length == 1 ? " meta" : " metas"}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <GoClock size={14} />
                                            {course.timers.filter(c => c.course_id != null).length}
                                            {course.timers.filter(c => c.course_id != null).length == 1 ? " sessão de estudo" : " sessões de estudo"}
                                        </p>
                                    </div>
                                    <div className="flex gap-4 w-full items-center ">
                                        <button onClick={() => { setModalConfirmDelete(true); setSelectedCourse(course) }} className="cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-red-600 hover:text-white text-red-600 flex w-full justify-center items-center gap-2 bg-zinc-200/10 rounded-md py-1 border border-gray-200">
                                            <GoTrash size={16} />
                                            Excluir
                                        </button>
                                        <button onClick={() => { setEditModalIsOpen(true); setSelectedCourse(course) }} className="cursor-pointer transition-all duration-300 hover:text-white hover:bg-blue-950 hover:scale-105 text-blue-950 flex w-full justify-center items-center gap-2 bg-zinc-200/10 rounded-md py-1 border border-gray-200">
                                            <GoPencil size={16} />
                                            Editar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                )}

            </Container>

            {createModalIsOpen && <CourseModal closeModal={() => setCreateModalIsOpen(false)} onSuccess={fetchCourses} mode="create" />}
            {editModalIsOpen && <CourseModal closeModal={() => setEditModalIsOpen(false)} onSuccess={fetchCourses} mode="edit" course={selectedCourse} />}
            {modalConfirmDelete && <ConfirmDelete closeModal={() => setModalConfirmDelete(false)} deleteCourse={deleteCourse} course={selectedCourse} />}

        </main>

    )
}
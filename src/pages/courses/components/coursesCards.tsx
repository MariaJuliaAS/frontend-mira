import { BsCalendar3 } from "react-icons/bs";
import { CiViewList } from "react-icons/ci";
import { GoClock, GoPencil, GoTrash } from "react-icons/go";
import { LiaClipboardListSolid } from "react-icons/lia";
import { LuBookOpen, LuTarget } from "react-icons/lu";
import { SlGraduation } from "react-icons/sl";
import type { CourseProps } from "../types/courseTypes";
import { useEffect } from "react";

interface Props {
    courseList: CourseProps[];
    onEdit: (course: CourseProps) => void;
    onDelete: (course: CourseProps) => void;
    refresh?: () => void;
}

export function CoursesCards({ courseList, onEdit, onDelete, refresh }: Props) {

    useEffect(() => { refresh && refresh() }, [courseList])

    return (
        courseList.length == 0 ? (
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
                                <button onClick={() => onDelete(course)} className="cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-red-600 hover:text-white text-red-600 flex w-full justify-center items-center gap-2 bg-zinc-200/10 rounded-md py-1 border border-gray-200">
                                    <GoTrash size={16} />
                                    Excluir
                                </button>
                                <button onClick={() => onEdit(course)} className="cursor-pointer transition-all duration-300 hover:text-white hover:bg-blue-950 hover:scale-105 text-blue-950 flex w-full justify-center items-center gap-2 bg-zinc-200/10 rounded-md py-1 border border-gray-200">
                                    <GoPencil size={16} />
                                    Editar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        )
    )
}
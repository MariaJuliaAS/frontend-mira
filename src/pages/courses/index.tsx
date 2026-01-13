import { Container } from "../../components/container";
import { SlGraduation } from "react-icons/sl";
import { CiViewList } from "react-icons/ci";
import { LiaClipboardListSolid } from "react-icons/lia";
import { LuBookOpen, LuTarget } from "react-icons/lu";
import { FiPlus } from "react-icons/fi";
import { BsCalendar3 } from "react-icons/bs";
import { useEffect, useState } from "react";
import { api } from "../../service/api";

interface CourseProps {
    id: string;
    name: string;
    color: string;
    created_at: string;
    updated_at: string;
    teacher?: string;
    user_id: string;
}


export function Courses() {
    const [courseList, setCourseList] = useState<CourseProps[]>([]);

    useEffect(() => {

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
                console.log(response.data);
            } catch (err) {
                console.error("Error fetching courses", err);
            }
        }

        fetchCourses();
    }, [])

    return (
        <main className="bg-zinc-200/10 min-h-screen">
            <Container>

                <header className="flex justify-between">
                    <div>
                        <h1 className="font-bold text-3xl">Matérias</h1>
                        <span className="text-zinc-500">Gerencie suas matérias</span>
                    </div>

                    <button className="flex items-center justify-center h-10 px-4 bg-blue-950 rounded-md text-white cursor-pointer hover:scale-105 transition-all sm:text-base text-sm">
                        <FiPlus size={20} className="mr-2" />
                        Nova Matéria
                    </button>
                </header>

                <section className="mt-12 grid grid-cols-3 gap-12">
                    {courseList.map((course) => (
                        <div key={course.id} className="bg-white border border-gray-200 rounded-2xl p-5 text-white shadow-lg hover:border-blue-800/40 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-800/40 p-3 rounded-xl">
                                    <LuBookOpen size={22} className="text-blue-950" />
                                </div>

                                <div>
                                    <p className="font-semibold text-lg text-black">{course.name}</p>
                                    <span className="text-zinc-500">
                                        {course.teacher ? `Prof. ${course.teacher}` : "Sem professor cadastrado"}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-zinc-400 text-sm mt-5">
                                <p className="flex items-center gap-2">
                                    <SlGraduation size={14} />
                                    2 provas
                                </p>

                                <p className="flex items-center gap-2">
                                    <LiaClipboardListSolid size={14} />
                                    3 trabalhos
                                </p>

                                <p className="flex items-center gap-2">
                                    <CiViewList size={14} />
                                    5 atividades
                                </p>

                                <p className="flex items-center gap-2">
                                    <BsCalendar3 size={14} />
                                    5 eventos
                                </p>

                                <p className="flex items-center gap-2">
                                    <LuTarget size={14} />
                                    5 metas
                                </p>
                            </div>
                        </div>
                    ))}
                </section>


            </Container>
        </main>
    )
}
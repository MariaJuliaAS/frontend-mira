import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineClose } from "react-icons/md";
import z from "zod";
import type { CourseProps } from "../../pages/courses";
import { api } from "../../service/api";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { LuLoader } from "react-icons/lu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ModalProps {
    closeModal: () => void;
    onSuccess?: () => void;
}

const schema = z.object({
    name: z.string().nonempty("O campo nome é obrigatório"),
    description: z.string().optional(),
    end_date: z.string().nonempty("O campo prazo é obrigatório"),
    course_id: z.string().optional()
})
type FormData = z.infer<typeof schema>;

export function CreateGoalModal({ closeModal, onSuccess }: ModalProps) {

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })
    const [loading, setLoading] = useState(false);
    const [courseList, setCourseList] = useState<CourseProps[]>([]);

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

    async function onSubmit(data: FormData) {
        const token = localStorage.getItem("@tokenMira");
        setLoading(true);

        if (!token) {
            console.error("No token found");
            return;
        }
        console.log(data.course_id)

        try {
            const date = format(data.end_date + "T00:00:00", "dd/MM/yyyy", { locale: ptBR })
            if (!data.course_id) {
                await api.post("/goal", {
                    name: data.name,
                    description: data.description,
                    end_date: date
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            } else {
                await api.post(`/goal/courses/${data.course_id}`, {
                    name: data.name,
                    description: data.description,
                    end_date: date
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            }
        } catch (err) {
            console.error("Erro ao criar meta: ", err);
        } finally {
            closeModal();
            setLoading(false);
            onSuccess?.();
        }
    }

    return (
        <div
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <main
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xl rounded-xl bg-white p-6 shadow-lg">

                <header className="border-b border-gray-200">
                    <div className="flex  justify-between mb-2">
                        <p className="font-bold sm:text-lg text-base">Nova meta</p>
                        <MdOutlineClose onClick={closeModal} size={25} className="cursor-pointer mb-4 text-black transition-all duration-200 hover:text-red-500" />
                    </div>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                    <label className="text-black font-medium mt-4 mb-1 sm:text-base text-sm">Nome</label>
                    <Input
                        type="text"
                        placeholder="Nome da meta"
                        name="name"
                        register={register}
                        error={errors.name?.message}
                    />
                    <label className="text-black font-medium mt-4 mb-1 sm:text-base text-sm">Prazo</label>
                    <Input
                        type="date"
                        name="end_date"
                        register={register}
                        error={errors.end_date?.message}
                    />
                    <label className="text-black font-medium mt-4 mb-1 sm:text-base text-sm">Matéria {"("}opcional{")"}</label>
                    <select
                        className="rounded-lg border-2 border-gray-200 w-full outline-none px-3 py-2 bg-white"
                        {...register("course_id")}
                    >
                        <option value="">Selecione um tipo</option>
                        {courseList.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    <label className="text-black font-medium mt-4 mb-1 sm:text-base text-sm">Descrição {"("}opcional{")"}</label>
                    <textarea className="rounded-lg border-2 border-gray-200 w-full outline-none px-2"
                        rows={3}
                        placeholder="Detalhes da meta"
                        id="description"
                        {...register("description")}
                    />
                    <div className="flex mt-6 gap-4 justify-end ">
                        <button onClick={closeModal} className="px-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-red-600 hover:text-white text-red-600 flex justify-center items-center gap-2 bg-zinc-200/10 rounded-md py-1 border border-gray-200">
                            Cancelar
                        </button>
                        <Button disabled={loading} type="submit">
                            {loading ? (
                                <LuLoader size={18} className="animate-spin" />
                            ) : "Criar meta"}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    )
}
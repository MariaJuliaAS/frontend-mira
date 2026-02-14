import { MdOutlineClose } from "react-icons/md";
import { Input } from "../../../components/ui/Input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../components/ui/Button";
import { LuLoader } from "react-icons/lu";
import { useEffect, useState } from "react";
import type { CourseModalModel, CourseProps } from "../types/courseTypes";
import { useCourse } from "../hooks/useCourse";

interface ModalProps {
    closeModal: () => void;
    mode: CourseModalModel;
    course?: CourseProps | null;
}

const schema = z.object({
    name: z.string().nonempty("O campo nome é obrigatório"),
    teacher: z.string()
})
type FormData = z.infer<typeof schema>;

export function CourseModal({ closeModal, mode, course }: ModalProps) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })
    const { createCourse, editCourse } = useCourse();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode == "edit" && course) {
            reset({
                name: course.name,
                teacher: course.teacher
            })
        } else {
            reset({
                name: "",
                teacher: ""
            })
        }
    }, [])

    async function onSubmit(data: FormData) {
        setLoading(true)

        if (mode == "create") {
            createCourse(data);
        }

        if (mode == "edit" && course) {
            editCourse(data, course.id);
        }

        closeModal();
    }

    return (
        <div onClick={closeModal} className="bg-black/40 fixed inset-0 flex items-center justify-center z-10">
            <main onClick={(e) => e.stopPropagation()} className="max-h-11/12 overflow-y-auto bg-white sm: w-8/12 max-w-xl h-auto flex flex-col rounded-lg p-6 ">

                <header className="border-b border-gray-200">
                    <div className="flex  justify-between mb-2">
                        <p className="font-bold sm:text-lg text-base">{mode == "create" ? "Nova matéria" : "Editar matéria"}</p>
                        <MdOutlineClose onClick={closeModal} size={25} className="cursor-pointer mb-4 text-black transition-all duration-200 hover:text-red-500" />
                    </div>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                    <label className="text-black font-medium mt-4 mb-1 sm:text-base text-sm">Matéria</label>
                    <Input
                        type="text"
                        placeholder="Ex.: Programação Orientada à Objetos"
                        name="name"
                        register={register}
                        error={errors.name?.message}
                    />
                    <label className="text-black font-medium mt-4 mb-1 sm:text-base text-sm">Professor{"("}a{")"}</label>
                    <Input
                        type="text"
                        placeholder="Ex.: Marcos Oliveira"
                        name="teacher"
                        register={register}
                        error={errors.teacher?.message}
                    />
                    <div className="flex mt-6 gap-4">
                        <button onClick={closeModal} className="cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-red-600 hover:text-white text-red-600 flex w-full justify-center items-center gap-2 bg-zinc-200/10 rounded-md py-1 border border-gray-200">
                            Cancelar
                        </button>
                        <Button disabled={loading} type="submit" width="w-full">
                            {loading ? (
                                <LuLoader size={18} className="animate-spin" />
                            ) : mode === "create" ? (
                                "Criar matéria"
                            ) : (
                                "Salvar alterações"
                            )}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    )
}
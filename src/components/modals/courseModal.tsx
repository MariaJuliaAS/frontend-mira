import { MdOutlineClose } from "react-icons/md";
import { Input } from "../ui/Input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/Button";
import { LuLoader } from "react-icons/lu";
import { useEffect, useState } from "react";
import { api } from "../../service/api";

type CourseModalModel = "create" | "edit";

interface ModalProps {
    closeModal: () => void;
    onSuccess: () => void;
    mode: CourseModalModel;
    course?: CourseProps | null;
}

interface CourseProps {
    id: string;
    name: string;
    teacher?: string;
}

const schema = z.object({
    name: z.string().nonempty("O campo nome é obrigatório"),
    teacher: z.string()
})
type FormData = z.infer<typeof schema>;

export function CourseModal({ closeModal, mode, onSuccess, course }: ModalProps) {
    const token = localStorage.getItem("@tokenMira");

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })
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

        try {

            if (mode == "create") {
                await api.post("/course",
                    {
                        name: data.name,
                        teacher: data.teacher
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                alert("Matéria criada com sucesso!")
            }

            if (mode == "edit" && course) {
                await api.put(`/course/${course.id}`, {
                    name: data.name,
                    teacher: data.teacher
                },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                alert("Matéria editada com sucesso!")
            }

            onSuccess();
            closeModal();
        } catch (err) {
            console.log("Error ao criar/editar matéria: ", err)
        } finally {
            setLoading(false)
        }

    }

    return (
        <div onClick={closeModal} className="bg-black/40 fixed inset-0 flex items-center justify-center z-10">
            <main onClick={(e) => e.stopPropagation()} className="max-h-11/12 overflow-y-auto bg-white w-6/12 max-w-xl h-auto flex flex-col rounded-lg p-6 ">

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
import { MdOutlineClose } from "react-icons/md";
import { Input } from "../ui/Input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/Button";
import { LuLoader } from "react-icons/lu";
import { useState } from "react";

type CourseModalModel = "create" | "edit";

interface ModalProps {
    closeModal: () => void;
    mode: CourseModalModel;
}

const schema = z.object({
    name: z.string().nonempty("O campo nome é obrigatório"),
    teacher: z.string().nonempty("O campo professor é obrigatório")
})
type FormData = z.infer<typeof schema>;

export function CreateCourseModal({ closeModal, mode }: ModalProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })
    const [loading, setLoading] = useState(false);

    return (
        <div onClick={closeModal} className="bg-black/40 fixed inset-0 flex items-center justify-center z-10">
            <main onClick={(e) => e.stopPropagation()} className="max-h-11/12 overflow-y-auto bg-white w-6/12 max-w-xl h-auto flex flex-col rounded-lg p-6 ">

                <header className="border-b border-gray-200">
                    <div className="flex  justify-between mb-2">
                        <p className="font-bold sm:text-lg text-base">{mode == "create" ? "Nova matéria" : "Editar matéria"}</p>
                        <MdOutlineClose onClick={closeModal} size={25} className="cursor-pointer mb-4 text-black transition-all duration-200 hover:text-red-500" />
                    </div>
                </header>

                <form className="flex flex-col">
                    <label className="text-black font-medium mt-4 mb-1 sm:text-base text-sm">Matériaa</label>
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
                    <Button disabled={loading} type="submit" width="w-full mt-6">
                        {loading ?
                            <LuLoader size={18} color="#fff" className="animate-spin flex items-center justify-center" /> :
                            "Criar matéria"}
                    </Button>
                </form>
            </main>
        </div>
    )
}
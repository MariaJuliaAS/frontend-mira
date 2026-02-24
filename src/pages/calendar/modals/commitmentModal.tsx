import { MdOutlineClose } from "react-icons/md";
import { Input } from "../../../components/ui/Input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/Button";
import { CommitmentType } from "../constants/commitmentTypes";
import type { CreateCommitmentDTO } from "../types/calendarTypes";

const COMMITMENT_TYPE_OPTIONS = Object.entries(CommitmentType).map(([key, value]) => ({
    label: key.charAt(0) + key.slice(1).toLowerCase(),
    value
}));

interface ModalProps {
    closeModal: () => void;
    createCommitment: (data: CreateCommitmentDTO) => void;
    courseList: CourseProps[];
}

interface CourseProps {
    id: string;
    name: string;
}

const schema = z.object({
    name: z.string().nonempty("O campo nome é obrigatório"),
    date: z.string().nonempty("O campo data é obrigatório"),
    type: z.string().optional(),
    course_id: z.string().optional(),
    description: z.string().optional()
})
export type FormData = z.infer<typeof schema>;

export function CommitmentModal({ closeModal, createCommitment, courseList }: ModalProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    function onSubmit(data: FormData) {
        createCommitment({
            name: data.name,
            date: new Date(data.date + "T00:00:00"),
            type: data.type,
            course_id: data.course_id,
            description: data.description
        });
        closeModal();
    }

    return (
        <div onClick={closeModal} className="bg-black/40 fixed inset-0 flex items-center justify-center z-10">
            <main onClick={(e) => e.stopPropagation()} className="max-h-11/12 overflow-y-auto bg-white sm: w-8/12 max-w-xl h-auto flex flex-col rounded-lg p-6 ">

                <header className="border-b border-gray-200">
                    <div className="flex  justify-between mb-2">
                        <p className="font-bold sm:text-lg text-base">Novo compromisso</p>
                        <MdOutlineClose onClick={closeModal} size={25} className="cursor-pointer mb-4 text-black transition-all duration-200 hover:text-red-500" />
                    </div>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                    <label className="text-black font-medium mt-4 mb-1 sm:text-base text-sm">Título</label>
                    <Input
                        type="text"
                        placeholder="Nome do compromisso"
                        name="name"
                        register={register}
                        error={errors.name?.message}
                    />
                    <label className="text-black font-medium mt-4 mb-1 sm:text-base text-sm">Data</label>
                    <Input
                        type="date"
                        name="date"
                        register={register}
                        error={errors.date?.message}
                    />
                    <label className="text-black font-medium mt-4 mb-1 sm:text-base text-sm">Tipo</label>
                    <select
                        className="rounded-lg border-2 border-gray-200 w-full outline-none px-3 py-2 bg-white"
                        {...register("type")}
                    >
                        <option value="" disabled>Selecione um tipo</option>
                        {COMMITMENT_TYPE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

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
                        placeholder="Detalhes do compromisso"
                        id="description"
                        {...register("description")}
                    />
                    <div className="flex mt-6 gap-4">
                        <button onClick={closeModal} className="cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-red-600 hover:text-white text-red-600 flex w-full justify-center items-center gap-2 bg-zinc-200/10 rounded-md py-1 border border-gray-200">
                            Cancelar
                        </button>
                        <Button type="submit" width="w-full">
                            Criar compromisso
                        </Button>
                    </div>
                </form>

            </main>
        </div>
    )
}
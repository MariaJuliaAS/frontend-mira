import { IoReload } from "react-icons/io5";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateTimerDTO } from "../types/timerTypes";

const schema = z.object({
    topic: z.string().min(1, "O tópico é obrigatório"),
    pages: z.string().optional(),
    questions: z.string().optional(),
    correctQuestions: z.string().optional(),
    video: z.string().optional(),
    revision: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

interface DetailSessionFormProps {
    onSubmit: (data: CreateTimerDTO, totalSeconds: number, isCourse: boolean, typeSelectedId: string | null) => Promise<void>;
    disabledDetails: boolean;
    totalSeconds: number;
    isCourse: boolean;
    typeSelectedId: string | null;
}

export function DetailSessionForm({
    onSubmit,
    disabledDetails,
    totalSeconds,
    isCourse,
    typeSelectedId
}: DetailSessionFormProps) {
    const { register, handleSubmit, formState: { errors }, reset: resetForm } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    });

    async function handleFormSubmit(data: FormData) {
        const timerData: CreateTimerDTO = {
            topic: data.topic,
            pages: data.pages,
            questions: data.questions,
            correctQuestions: data.correctQuestions,
            video: data.video,
            revision: data.revision,

        };

        await onSubmit(timerData, totalSeconds, isCourse, typeSelectedId);
    }

    return (
        <section className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <h2 className="font-semibold text-base sm:text-lg mb-4">Detalhes da Sessão</h2>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="mb-4">
                    <label className="block text-xs sm:text-sm font-medium mb-1">Tópico</label>
                    <Input
                        type="text"
                        name="topic"
                        placeholder="Ex.: POO"
                        register={register}
                        error={errors.topic?.message}
                    />
                </div>
                <div className="mb-4">
                    <label className="flex items-center text-gray-500 text-xs sm:text-sm bg-blue-300/20 py-1 px-2 rounded-lg border border-blue-300/30 cursor-pointer">
                        <input
                            type="checkbox"
                            {...register("revision")}
                            className="mr-2 cursor-pointer"
                        />
                        <IoReload size={12} className="mr-1 shrink-0" />
                        <span className="whitespace-nowrap">Esta sessão é uma revisão</span>
                    </label>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1">Páginas Lidas</label>
                        <Input
                            type="number"
                            name="pages"
                            placeholder="0"
                            register={register}
                            error={errors.pages?.message}
                        />
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1">Min de Vídeo</label>
                        <Input
                            type="number"
                            name="video"
                            placeholder="0"
                            register={register}
                            error={errors.video?.message}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1">Total de Questões</label>
                        <Input
                            type="number"
                            name="questions"
                            placeholder="0"
                            register={register}
                            error={errors.questions?.message}
                        />
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1">Questões Certas</label>
                        <Input
                            type="number"
                            name="correctQuestions"
                            placeholder="0"
                            register={register}
                            error={errors.correctQuestions?.message}
                        />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                        width={`flex-1 ${disabledDetails ? '' : 'opacity-50 hover:cursor-default'}`}
                        type="submit"
                        disabled={!disabledDetails}
                    >
                        <span className="py-1">Salvar Sessão</span>
                    </Button>
                    <button
                        type="button"
                        onClick={() => resetForm()}
                        className="cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-red-600 hover:text-white text-red-600 px-3 sm:px-4 py-1 sm:py-2 flex justify-center items-center gap-1 sm:gap-2 bg-zinc-200/10 rounded-md border border-gray-200 text-xs sm:text-sm"
                    >
                        Limpar campos
                    </button>
                </div>
            </form>
        </section>
    );
}
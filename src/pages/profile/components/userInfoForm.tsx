import { GoPencil } from "react-icons/go";
import { FaRegSave } from "react-icons/fa";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import type { UserDetailProps } from "../types/profileTypes";

const schema = z.object({
    program: z.string().optional(),
    period: z.string().optional(),
    university: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface UserInfoFormProps {
    user?: UserDetailProps;
    isEditing: boolean;
    onEdit: () => void;
    onCancel: () => void;
    onSubmit: (data: FormData) => void;
}

export function UserInfoForm({ user, isEditing, onEdit, onCancel, onSubmit }: UserInfoFormProps) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
        values: {
            program: user?.profiles?.program || "",
            period: user?.profiles?.period ? String(user.profiles.period) : "",
            university: user?.profiles?.university || ""
        }
    });

    const handleCancel = () => {
        reset();
        onCancel();
    };

    return (
        <>
            <div className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <h2 className="text-base sm:text-lg font-semibold capitalize">Informações do Usuário</h2>
                {isEditing ? (
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button
                            className="cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-red-600 hover:text-white text-red-600 px-3 sm:px-4 py-2 flex justify-center items-center gap-1 sm:gap-2 bg-zinc-200/10 rounded-md border border-gray-200 text-xs sm:text-sm"
                            onClick={handleCancel}
                        >
                            Cancelar
                        </button>
                        <Button width="flex-1 sm:flex-none" onClick={handleSubmit(onSubmit)}>
                            <FaRegSave size={14} className="mr-1 sm:mr-2" />
                            <span className="py-1">Salvar</span>
                        </Button>
                    </div>
                ) : (
                    <button
                        onClick={onEdit}
                        className="cursor-pointer transition-all duration-300 hover:text-white hover:bg-blue-950 hover:scale-105 text-blue-950 flex px-3 sm:px-4 justify-center items-center gap-1 sm:gap-2 bg-zinc-200/10 rounded-md py-2 border border-gray-200 text-xs sm:text-sm"
                    >
                        <GoPencil size={14} />
                        {user?.profiles ? "Editar" : "Adicionar"}
                    </button>
                )}
            </div>

            {isEditing ? (
                <form className="space-y-4 mt-6">
                    <div>
                        <label className="text-black font-medium mb-2 sm:text-base text-xs block">Curso</label>
                        <Input
                            type="text"
                            placeholder="Ex.: Ciência da Computação"
                            name="program"
                            register={register}
                            error={errors.program?.message}
                        />
                    </div>
                    <div>
                        <label className="text-black font-medium mb-2 sm:text-base text-xs block">Período</label>
                        <Input
                            type="number"
                            placeholder="Ex.: 3"
                            name="period"
                            register={register}
                            error={errors.period?.message}
                        />
                    </div>
                    <div>
                        <label className="text-black font-medium mb-2 sm:text-base text-xs block">Universidade</label>
                        <Input
                            type="text"
                            placeholder="Ex.: UFERSA"
                            name="university"
                            register={register}
                            error={errors.university?.message}
                        />
                    </div>
                </form>
            ) : null}
        </>
    );
}

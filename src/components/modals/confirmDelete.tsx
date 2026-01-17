import { api } from "../../service/api";

interface ConfirmDeleteProps {
    closeModal: () => void;
    course?: CourseProps | null;
}

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

export function ConfirmDelete({ closeModal, course }: ConfirmDeleteProps) {
    const items = [
        {
            count: course?.commitments.filter(c => c.type === "Prova").length ?? 0,
            label: "prova",
        },
        {
            count: course?.commitments.filter(c => c.type === "Trabalho").length ?? 0,
            label: "trabalho",
        },
        {
            count: course?.commitments.filter(c => c.type === "Atividade").length ?? 0,
            label: "atividade",
        },
        {
            count: course?.commitments.filter(c => c.type === "Evento").length ?? 0,
            label: "evento",
        },
        {
            count: course?.goals.filter(g => g.course_id != null).length ?? 0,
            label: "meta",
        },
        {
            count: course?.timers.filter(t => t.course_id != null).length ?? 0,
            label: "sessão de estudo",
        },
    ];
    const hasRelatedItems = items.some(item => item.count > 0);
    const token = localStorage.getItem("@tokenMira");

    async function handleDelete() {
        if (!course) {
            console.log("Nenhum curso a ser deletado")
        }

        try {
            await api.delete(`/course/${course?.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            alert("Matéria deletada com sucesso!")
            closeModal;
        } catch (err) {
            console.log("Erro ao deletar matéria ", err)
        }
    }

    return (
        <div onClick={closeModal} className="bg-black/40 fixed inset-0 flex items-center justify-center z-10">
            <main onClick={(e) => e.stopPropagation()} className="max-h-11/12 overflow-y-auto bg-white sm:w-4/12 w-8/12 max-w-xl h-auto flex flex-col rounded-md p-6 ">
                {hasRelatedItems ? (
                    <>
                        <p className="sm:text-lg text-base">
                            A matéria <strong>{course?.name}</strong> contém{" "}
                            {items
                                .filter(item => item.count > 0)
                                .map((item, index, array) => (
                                    <span key={item.label}>
                                        {item.count} {item.label}
                                        {item.count > 1 ? "s" : ""}
                                        {index < array.length - 1 ? ", " : ""}
                                    </span>
                                ))}
                            . Essa ação excluirá tudo e será irreversível.
                        </p>
                        <p className="sm:text-lg text-base">Deseja excluir mesmo assim?</p>
                    </>
                ) : (
                    <p>Deseja excluir essa matéria?</p>
                )}

                <div className="flex gap-4 w-full items-center mt-4">
                    <button onClick={closeModal} className="cursor-pointer transition-all duration-300 hover:scale-105  text-red-600 flex w-full justify-center items-center gap-2 bg-zinc-200/10 rounded-md py-1 border border-gray-200">
                        Cancelar
                    </button>
                    <button onClick={handleDelete} className="cursor-pointer transition-all duration-300 hover:scale-105 bg-red-600 text-white flex w-full justify-center items-center gap-2 rounded-md py-1 border border-gray-200">
                        Excluir
                    </button>
                </div>

            </main>
        </div>
    )
}
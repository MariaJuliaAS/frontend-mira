import type { CourseProps } from "../../pages/courses/types/courseTypes";
import type { GoalsProps } from "../../pages/goals/types/goalsTypes";

interface ConfirmDeleteProps {
    closeModal: () => void;
    onSuccess?: () => void;
    course?: CourseProps | null;
    goal?: GoalsProps | null;
    deleteGoal?: (id: string) => void;
    deleteCourse?: (id: string) => void;
}


export function ConfirmDelete({ closeModal, course, goal, onSuccess, deleteGoal, deleteCourse }: ConfirmDeleteProps) {
    const items = [
        {
            count: course?.commitments.filter(c => c.type === "PROVA").length ?? 0,
            label: "prova",
        },
        {
            count: course?.commitments.filter(c => c.type === "TRABALHO").length ?? 0,
            label: "trabalho",
        },
        {
            count: course?.commitments.filter(c => c.type === "ATIVIDADE").length ?? 0,
            label: "atividade",
        },
        {
            count: course?.commitments.filter(c => c.type === "EVENTO").length ?? 0,
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

    async function handleDelete() {
        try {
            if (course) {
                deleteCourse?.(course.id);
            }

            if (goal) {
                deleteGoal?.(goal.id);
            }
        } catch (err) {
            console.error("Erro ao deletar matéria/ meta: ", err)
        } finally {
            onSuccess?.();
            closeModal();
        }

    }

    return (
        <div onClick={closeModal} className="bg-black/40 fixed inset-0 flex items-center justify-center z-10">
            <main onClick={(e) => e.stopPropagation()} className="max-h-11/12 overflow-y-auto bg-white sm:w-4/12 w-8/12 max-w-xl h-auto flex flex-col rounded-md p-6 ">

                {goal && (
                    <>
                        <p className="sm:text-lg text-base">
                            A meta <strong>{goal?.name}</strong>
                            {goal.goalsTopcis && goal.goalsTopcis?.length > 0 ? ` contém ${goal.goalsTopcis.length} tópico${goal.goalsTopcis.length > 1 ? "s" : ""}` : " não contém nenhum tópico"}.
                        </p>
                    </>
                )}

                {course && hasRelatedItems && (
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
                                ))}.
                        </p>
                    </>
                )}

                <p className="sm:text-lg text-base">Essa ação excluirá tudo e será irreversível. Deseja excluir mesmo assim?</p>

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
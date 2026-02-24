import { FiPlus } from "react-icons/fi";
import { Container } from "../../components/container";
import { Button } from "../../components/ui/Button";
import { useState } from "react";
import { ConfirmDelete } from "../../components/modals/confirmDelete";
import { CreateGoalModal } from "./modals/createGoalModal";
import { useGoals } from "./hooks/useGoals";
import { GoalsCard } from "./components/goalsCard";
import { GoalsTopicsList } from "./components/goalsTopicsList";
import { HeaderPages } from "../../components/ui/HeaderPages";
import { formatDateIgnoringTimezone } from "./utils/formatDate";

export function Goals() {
    const {
        goals,
        selectedGoal,
        setSelectedGoal,
        deleteGoal,
        toggleTopicCompletion,
        deleteGoalTopic,
        addGoalTopic,
        refresh
    } = useGoals();

    const [modalConfirmDelete, setModalConfirmDelete] = useState<boolean>(false);
    const [modalCreateGoal, setModalCreateGoal] = useState<boolean>(false);
    const [topicName, setTopicName] = useState<string>("");

    return (
        <main className="bg-zinc-200/10 min-h-screen">
            <Container>
                <HeaderPages
                    title="Metas"
                    subTitle="Defina e acompanhe seus objetivos"
                >
                    <Button
                        onClick={() => setModalCreateGoal(true)}
                        type="button">
                        <FiPlus size={16} className="mr-1 sm:mr-2" />
                        <span className="text-xs sm:text-sm">Nova Meta</span>
                    </Button>
                </HeaderPages>

                <div className="mt-6 sm:mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0">
                    <section className="lg:col-span-1">
                        {goals.map((g) => (
                            <GoalsCard
                                key={g.id}
                                goal={g}
                                isSelected={selectedGoal?.id === g.id}
                                onSelect={setSelectedGoal}
                                onDelete={() => {
                                    setSelectedGoal(g);
                                    setModalConfirmDelete(true);
                                }}
                            />
                        ))}
                    </section>

                    <section className="lg:col-span-2 bg-white border border-gray-200 rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                        {selectedGoal ? (
                            <div>
                                <div className="mb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="font-bold text-base sm:text-xl truncate">{selectedGoal?.name}</p>
                                        <span className="italic text-gray-500 text-xs sm:text-sm block truncate">{selectedGoal?.description}</span>
                                    </div>
                                    <span className="text-gray-500 text-xs sm:text-sm shrink-0">
                                        {formatDateIgnoringTimezone(selectedGoal.end_date)}
                                    </span>
                                </div>

                                <GoalsTopicsList
                                    topics={selectedGoal.goalsTopcis}
                                    topicName={topicName}
                                    onTopicNameChange={setTopicName}
                                    onAddTopic={() => {
                                        if (topicName.trim()) {
                                            addGoalTopic(topicName);
                                            setTopicName("");
                                        }
                                    }}
                                    onToggleTopic={toggleTopicCompletion}
                                    onDeleteTopic={deleteGoalTopic}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-40">
                                <p className="text-gray-500 text-sm">Selecione uma meta para ver os detalhes</p>
                            </div>
                        )}
                    </section>
                </div>

            </Container>

            {modalConfirmDelete && (
                <ConfirmDelete
                    closeModal={() => setModalConfirmDelete(false)}
                    goal={selectedGoal}
                    deleteGoal={deleteGoal}
                />
            )}
            {modalCreateGoal && (
                <CreateGoalModal
                    onSuccess={refresh}
                    closeModal={() => setModalCreateGoal(false)}
                />
            )}

        </main>
    )
}
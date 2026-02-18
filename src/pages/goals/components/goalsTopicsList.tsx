import { FiPlus } from "react-icons/fi";
import { TbTrash } from "react-icons/tb";
import type { GoalTopicProps } from "../types/goalsTypes";

interface GoalsTopicsListProps {
    topics: GoalTopicProps[] | undefined;
    topicName: string;
    onTopicNameChange: (name: string) => void;
    onAddTopic: () => void;
    onToggleTopic: (topicId: string) => void;
    onDeleteTopic: (topicId: string) => void;
}

export function GoalsTopicsList({
    topics,
    topicName,
    onTopicNameChange,
    onAddTopic,
    onToggleTopic,
    onDeleteTopic
}: GoalsTopicsListProps) {
    return (
        <div className="mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4">
                <h3 className="font-semibold text-sm sm:text-lg">Tópicos Técnicos</h3>
                <div className="flex gap-2 w-full sm:w-auto">
                    <input
                        className="h-9 sm:h-10 rounded-lg border-2 border-gray-200 flex-1 sm:flex-none outline-none px-2 sm:px-3 text-xs sm:text-sm"
                        placeholder="Adicione um tópico"
                        type="text"
                        value={topicName}
                        onChange={(e) => onTopicNameChange(e.target.value)}
                    />
                    <button
                        onClick={onAddTopic}
                        className="flex items-center justify-center gap-1 rounded-lg border border-gray-300 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-600 cursor-pointer hover:bg-blue-950 hover:text-white transition-all duration-300 shrink-0"
                    >
                        <FiPlus size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {topics && topics.length > 0 ? (
                    topics.map((t) => (
                        <div
                            key={t.id}
                            className={`flex items-center justify-between gap-3 rounded-lg sm:rounded-xl border p-3 sm:p-4 transition-all duration-300 ${t.completed
                                    ? "border-green-500 bg-green-500/30"
                                    : "border-gray-300 bg-white hover:border-blue-950"
                                }`}
                        >
                            <div onClick={() => onToggleTopic(t.id)} className="flex gap-2 cursor-pointer min-w-0 flex-1">
                                <div
                                    className={`flex h-5 sm:h-6 w-5 sm:w-6 items-center justify-center rounded-full border-2 transition-all duration-300 shrink-0 ${t.completed ? "border-none" : "border-gray-400"
                                        }`}
                                >
                                    {t.completed && (
                                        <div className="bg-green-500/80 rounded-full h-5 sm:h-6 w-5 sm:w-6 text-white text-center flex items-center justify-center text-xs">
                                            ✓
                                        </div>
                                    )}
                                </div>
                                <p className={`font-medium text-xs sm:text-sm truncate ${t.completed ? "text-green-500" : "text-gray-900"
                                    }`}>
                                    {t.name}
                                </p>
                            </div>
                            <button
                                onClick={() => onDeleteTopic(t.id)}
                                className="transition-all duration-300 hover:text-red-600 cursor-pointer shrink-0"
                            >
                                <TbTrash size={16} className="sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-8">
                        <p className="text-gray-400 text-xs sm:text-sm">Nenhum tópico adicionado ainda</p>
                    </div>
                )}
            </div>
        </div>
    );
}

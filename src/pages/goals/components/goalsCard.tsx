import { LuTarget } from "react-icons/lu";
import { TbTrash } from "react-icons/tb";
import { BsLightning } from "react-icons/bs";
import type { GoalsProps } from "../types/goalsTypes";
import { formatDateIgnoringTimezone } from "../utils/formatDate";

interface GoalsCardProps {
    goal: GoalsProps;
    isSelected: boolean;
    onSelect: (goal: GoalsProps) => void;
    onDelete: (goalId: string) => void;
}

export function GoalsCard({ goal, isSelected, onSelect, onDelete }: GoalsCardProps) {
    return (
        <div className="flex items-center gap-3 sm:gap-6 relative">
            <div
                onClick={() => onSelect(goal)}
                className={`w-full bg-white border rounded-lg sm:rounded-2xl p-3 sm:p-4 shadow-lg mb-3 sm:mb-4 transition-all duration-300 cursor-pointer hover:scale-105 hover:border-blue-950 ${isSelected ? "border-blue-950 scale-105" : "border-gray-200"
                    }`}
            >
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-blue-100 text-blue-600 font-semibold shrink-0">
                            <LuTarget size={18} className="sm:w-6 sm:h-6 text-blue-950" />
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-xs sm:text-base font-semibold text-gray-900 truncate">
                                {goal.name}
                            </h2>
                            <p className="text-xs text-gray-500 truncate">
                                Prazo: {formatDateIgnoringTimezone(goal.end_date)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(goal.id);
                        }}
                        className="cursor-pointer flex items-center justify-center w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm shrink-0"
                    >
                        <TbTrash size={14} className="sm:w-4 sm:h-4" />
                    </button>
                </div>

                <div className="flex gap-2 mt-2 flex-wrap">
                    {goal.course && (
                        <span className="text-xs text-gray-500 truncate">
                            {goal.course.name}
                        </span>
                    )}

                    {goal.goalsTopcis && (
                        <span className="text-xs text-gray-500 flex items-center gap-1 shrink-0">
                            <BsLightning size={12} className="text-blue-600" />
                            {goal.goalsTopcis?.length} tópico(s)
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

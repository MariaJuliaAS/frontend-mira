import { LuBookOpen, LuTarget } from "react-icons/lu";
import { CiCircleQuestion, CiVideoOn, CiViewList } from "react-icons/ci";
import { IoReload } from "react-icons/io5";
import { FiTrash2 } from "react-icons/fi";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { SessionProps } from "../types/timerTypes";

interface SessionsListProps {
    sessionsList: SessionProps[];
    onDeleteSession: (id: string) => void;
}

export function SessionsList({ sessionsList, onDeleteSession }: SessionsListProps) {
    function secondsToHours(totalSeconds: number) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours}h${minutes}m${seconds}s`;
    }

    return (
        <section className="flex flex-1 bg-white border border-gray-200 rounded-xl sm:rounded-2xl py-4 sm:py-6 shadow-lg min-h-max">
            <div className="w-full">
                <h2 className="font-semibold text-base sm:text-lg mb-4 px-4">Sessões recentes</h2>
                <div className="max-h-96 sm:max-h-none overflow-y-auto">
                    {sessionsList.length === 0 ? (
                        <p className="text-center text-gray-500 py-8 px-4 text-sm">Nenhuma sessão registrada ainda</p>
                    ) : (
                        sessionsList.map(session => (
                            <div key={session.id} className="pb-2 border-y border-gray-200 py-3 sm:py-4 w-full">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-4 gap-3 sm:gap-4 w-full">
                                    <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                                        <div className="bg-blue-300/30 p-1.5 sm:p-2 rounded-lg shrink-0">
                                            {session.course != null ?
                                                <LuBookOpen size={16} className="sm:w-5 sm:h-5 text-blue-950" /> :
                                                <LuTarget size={16} className="sm:w-5 sm:h-5 text-blue-950" />
                                            }
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap gap-2 sm:gap-2 items-center">
                                                <p className="font-medium text-xs sm:text-sm truncate">
                                                    {session.course?.name || session.goal?.name}
                                                </p>
                                                {session.revision ? (
                                                    <span className="bg-blue-300/20 text-gray-500 rounded-xl px-1.5 sm:px-2 py-0.5 flex items-center text-xs gap-0.5 shrink-0">
                                                        <IoReload size={10} className="sm:w-3.5 sm:h-3.5" />
                                                        <span className="hidden sm:inline">Revisão</span>
                                                    </span>
                                                ) : ""}
                                            </div>
                                            <span className="text-gray-500 text-xs block truncate mt-1">{session.topic}</span>
                                            <p className="text-gray-500 text-xs flex items-center flex-wrap gap-2 mt-1.5 sm:mt-2">
                                                <CiViewList size={12} className="shrink-0" />
                                                <span className="truncate">{session.pages}p</span>
                                                <CiVideoOn size={12} className="shrink-0" />
                                                <span className="truncate">{session.video}m</span>
                                                <CiCircleQuestion size={12} className="shrink-0" />
                                                <span className="truncate">{session.correctQuestions}/{session.questions}q</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1 shrink-0">
                                        <p className="font-medium text-xs sm:text-sm">
                                            {secondsToHours(session.time)}
                                        </p>

                                        <p className="text-xs text-gray-500 whitespace-nowrap">
                                            {format(session.created_at, "dd'/'MM", { locale: ptBR })}
                                        </p>

                                        <button
                                            onClick={() => onDeleteSession(session.id)}
                                            className="mt-0.5 sm:mt-1 flex items-center gap-0.5 text-xs text-red-600 hover:text-red-700 transition underline cursor-pointer hover:scale-105"
                                        >
                                            <FiTrash2 size={12} className="shrink-0" />
                                            <span className="hidden sm:inline">Excluir</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

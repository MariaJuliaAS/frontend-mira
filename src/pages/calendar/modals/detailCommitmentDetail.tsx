import { LuBookOpen, LuCalendar, LuFileText } from "react-icons/lu";
import { MdOutlineClose } from "react-icons/md";
import type { CommitmentsProps } from "../types/calendarTypes";

interface ModalProps {
    closeModal: () => void;
    commitment?: CommitmentsProps;
}

export function DetailCommitmentModal({ closeModal, commitment }: ModalProps) {

    return (
        <div
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        >
            <main
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xl rounded-xl bg-white p-6 shadow-lg"
            >
                <header className="border-b border-gray-200 pb-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                {commitment?.name}
                            </h2>
                            <span className="text-sm text-gray-400">
                                {commitment?.type.toLowerCase()}
                            </span>
                        </div>

                        <MdOutlineClose
                            size={22}
                            onClick={closeModal}
                            className="cursor-pointer text-gray-600 hover:text-red-500 transition"
                        />
                    </div>
                </header>

                <section className="mt-5 space-y-4 text-sm text-gray-700">
                    <div className="flex items-center gap-3">
                        <LuCalendar size={18} className="text-gray-500" />
                        <div>
                            <p className="text-gray-500">Data</p>
                            <p className="font-semibold">
                                {commitment?.date}
                            </p>
                        </div>
                    </div>

                    {commitment?.course && (
                        <div className="flex items-center gap-3">
                            <LuBookOpen size={18} className="text-gray-500" />
                            <div>
                                <p className="font-medium text-gray-900">Matéria</p>
                                <p>{commitment?.course.name}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-3">
                        <LuFileText size={18} className="text-gray-500 mt-1" />
                        <div>
                            <p className="font-medium text-gray-900">Descrição</p>
                            <p className="text-gray-500 italic">
                                {commitment?.description || "Nenhuma descrição adicionada"}
                            </p>
                        </div>
                    </div>
                </section>

                <footer className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={closeModal}
                        className="cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-red-600 hover:text-white text-red-600 px-4 py-1 flex justify-center items-center gap-2 bg-zinc-200/10 rounded-md border border-gray-200"
                    >
                        Fechar
                    </button>
                </footer>
            </main>
        </div>
    )
}
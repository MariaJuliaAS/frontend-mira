import { useState } from "react";
import { Container } from "../../components/container";
import { Button } from "../../components/ui/Button";
import { FiPlus } from "react-icons/fi";
import { CommitmentModal } from "./modals/commitmentModal";
import { LegendsCard } from "./components/legendesCard";
import { CalendarHeader } from "./components/calendarHeader";
import { CalendarGrid } from "./components/calendarGrid";
import { useCommitment } from "./hooks/useCommitment";
import { CommitmentCard } from "./components/commitmentCard";
import { HeaderPages } from "../../components/ui/HeaderPages";
import { DetailCommitmentModal } from "./modals/detailCommitmentDetail";
import { useCalendar } from "./context/calendarContext";
import { useCourse } from "../courses/hooks/useCourse";

export function Calendar() {
    const [createModalIsOpen, setCreateModalIsOpen] = useState<boolean>(false);
    const [detailModalIsOpen, setDetailModalIsOpen] = useState<Boolean>(false);
    const { commitments, deleteCommitment, refresh, createCommitment } = useCommitment();
    const { commitmentSelected, selectedDate, setCommitmentSelected, currentDate, setCurrentDate, setSelectedDate } = useCalendar();
    const { courses } = useCourse();

    return (
        <main className="bg-zinc-200/10 min-h-screen">
            <Container>
                <HeaderPages
                    title="Calendário"
                    subTitle="Gerencie todos os seus compromissos acadêmicos em um só lugar."
                    children={
                        <Button
                            type="button"
                            onClick={() => setCreateModalIsOpen(true)}
                        >
                            <FiPlus size={18} className="mr-2" />
                            Novo Compromisso
                        </Button>
                    }
                />

                <LegendsCard />

                <div className="flex w-full gap-8 mb-6 lg:flex-row flex-col">
                    <section className="flex-3 bg-white border border-gray-200 rounded-2xl p-4 shadow-lg">
                        <CalendarHeader
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                            setSelectedDate={setSelectedDate}
                        />
                        <CalendarGrid
                            commitments={commitments}
                            currentDate={currentDate}
                            setSelectedDate={setSelectedDate}
                            selectedDate={selectedDate}
                        />
                    </section>

                    <section className="rounded-2xl border border-gray-200 p-6 shadow-lg flex-1">
                        <CommitmentCard
                            commitments={commitments}
                            onDelete={deleteCommitment}
                            refresh={refresh}
                            selectedDate={selectedDate}
                            setCommitmentSelected={setCommitmentSelected}
                            onDetail={() => {
                                setDetailModalIsOpen(true)
                            }}
                        />
                    </section>
                </div>
            </Container>

            {detailModalIsOpen && <DetailCommitmentModal closeModal={() => setDetailModalIsOpen(false)} commitment={commitmentSelected} />}
            {createModalIsOpen && <CommitmentModal closeModal={() => setCreateModalIsOpen(false)} createCommitment={createCommitment} courseList={courses} />}
        </main>
    )
}
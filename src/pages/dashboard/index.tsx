import { Container } from "../../components/container";
import { HeaderPages } from "../../components/ui/HeaderPages";
import { useDashboard } from "./hooks/useDashboard";
import { StatsCards } from "./components/statsCards";
import { UpcomingGoals } from "./components/upcomingGoals";
import { UpcomingCommitments } from "./components/upcomingCommitments";
import { LuLoader } from "react-icons/lu";

export function Dashboard() {
    const { goals, commitments, userStats, isLoading } = useDashboard();

    if (isLoading) {
        return (
            <Container>
                <div className="flex items-center justify-center h-[60vh]">
                    <LuLoader size={40} className="animate-spin text-blue-950" />
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <HeaderPages
                title="Dashboard"
                subTitle="Visão geral dos seus estudos e compromissos"
            />

            <div className="mt-8 space-y-6">
                <StatsCards stats={userStats} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <UpcomingGoals goals={goals} />
                    <UpcomingCommitments commitments={commitments} />
                </div>
            </div>
        </Container>
    );
}
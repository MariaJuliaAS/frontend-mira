import { Container } from "../../components/container";
import { useState } from "react";
import { useProfile } from "./hooks/useProfile";
import { UserDisplay } from "./components/userDisplay";
import { UserInfoDisplay } from "./components/userInfoDisplay";
import { UserStatsDisplay } from "./components/userStatsDisplay";
import { UserInfoForm } from "./components/userInfoForm";
import { HeaderPages } from "../../components/ui/HeaderPages";

type FormData = {
    program?: string;
    period?: string;
    university?: string;
};

export function Profile() {
    const { userDetail, userStats, updateProfile, createProfile } = useProfile();
    const [isEditing, setIsEditing] = useState(false);

    function secondsToHours(totalSeconds: number | undefined) {
        if (totalSeconds === undefined) {
            return "0";
        }

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours}h${minutes}m${seconds}s`;
    }

    async function handleSubmit(data: FormData) {
        const profileData = {
            program: data.program,
            period: data.period ? Number(data.period) : undefined,
            university: data.university
        };

        let success = false;
        if (userDetail?.profiles) {
            success = await updateProfile(profileData);
        } else {
            success = await createProfile(profileData);
        }

        if (success) {
            setIsEditing(false);
        }
    }

    return (
        <main className="bg-zinc-200/10 min-h-screen">
            <Container>
                <HeaderPages
                    title="Perfil"
                    subTitle="Gerencie suas informações pessoais e acadêmicas"
                ></HeaderPages>

                <div className="mt-6 sm:mt-8 md:mt-12 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 min-h-full px-2 sm:px-0">
                    <section className="w-full lg:flex-2 bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                        <UserInfoForm
                            user={userDetail}
                            isEditing={isEditing}
                            onEdit={() => setIsEditing(true)}
                            onCancel={() => setIsEditing(false)}
                            onSubmit={handleSubmit}
                        />

                        <div className="mt-6 gap-4 flex flex-col">
                            <UserDisplay user={userDetail} />

                            {!isEditing && (
                                <UserInfoDisplay user={userDetail} />
                            )}
                        </div>
                    </section>

                    <section className="w-full lg:flex-1">
                        <UserStatsDisplay stats={userStats} secondsToHours={secondsToHours} />
                    </section>
                </div>
            </Container>
        </main>
    );
}
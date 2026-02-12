import { GoPencil } from "react-icons/go";
import { Container } from "../../components/container";
import { useEffect, useState } from "react";
import { api } from "../../service/api";
import { FaRegBuilding, FaRegSave, FaRegUser } from "react-icons/fa";
import { LuBookOpen, LuCalendar, LuClock, LuTarget } from "react-icons/lu";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface UserDetailProps {
    id: string;
    name: string;
    email: string;
    profiles?: {
        id: string;
        university?: string;
        period?: number;
        program?: string;
    }
}

interface UserStatsProps {
    totalStudyTime: {
        time: number
    };
    activeGoals: number;
    activeCourses: number;
}

const schema = z.object({
    program: z.string().optional(),
    period: z.string().optional(),
    university: z.string().optional(),
})
type FormData = z.infer<typeof schema>;

export function Profile() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })
    const [userDetail, setUserDetail] = useState<UserDetailProps>();
    const [userStats, setUserStats] = useState<UserStatsProps>();
    const [formsMode, setFormsMode] = useState<String>("");

    async function fetchUserDetail() {
        const token = localStorage.getItem("@tokenMira");

        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const response = await api.get("/user/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUserDetail(response.data);
        } catch (err) {
            console.error("Erro ao buscar detalhes do usuário: ", err)
        }
    }

    async function fetchUserStats() {
        const token = localStorage.getItem("@tokenMira");

        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const response = await api.get("/user/stats", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUserStats(response.data);
        } catch (err) {
            console.error("Erro ao buscar estatísticas do usuário: ", err)
        }
    }

    useEffect(() => {
        fetchUserDetail()
        fetchUserStats()
    }, [])

    function secondsToHours(totalSeconds: number | undefined) {
        if (totalSeconds === undefined) {
            return "0"
        }

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours}h${minutes}m${seconds}s`;
    }

    async function onSubmit(data: FormData) {
        const token = localStorage.getItem("@tokenMira")
        const profileId = userDetail?.profiles?.id

        try {
            if (userDetail?.profiles) {
                await api.put(`/profile/${profileId}`, {
                    university: data.university,
                    program: data.program,
                    period: Number(data.period)
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                alert("Edição feita com sucesso!")
            } else {
                await api.post("/profile", {
                    university: data.university,
                    program: data.program,
                    period: Number(data.period)
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                alert("Informações adicionadas com sucesso!")
            }
        } catch (err) {
            console.error("Erro ao editar/adicionar informações do perfil: ", err)
        }
    }

    function handleCancel() {
        reset();
        setFormsMode("");
        fetchUserDetail();
    }

    function toFormsMode() {
        setFormsMode("FormsMode")
        if (userDetail?.profiles && userDetail.profiles.period || userDetail?.profiles?.university || userDetail?.profiles?.program) {
            reset({
                program: userDetail.profiles.program,
                period: String(userDetail.profiles.period),
                university: userDetail.profiles.university
            })
        }
    }

    return (
        <main className="bg-zinc-200/10 min-h-screen">
            <Container>
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-bold text-2xl sm:text-3xl">Perfil</h1>
                        <span className="text-zinc-500 text-sm sm:text-base">
                            Gerencie suas informações pessoais e acadêmicas
                        </span>
                    </div>
                </header>

                <div className="mt-8 sm:mt-12 flex gap-6 lg:gap-8 min-h-full">
                    <section className="w-full flex-2 bg-white border border-gray-200 rounded-2xl p-4 shadow-lg">
                        <div className="flex w-full justify-between">
                            <h2 className="text-lg font-semibold capitalize flex items-center gap-2">Informações do Usuário</h2>
                            {formsMode === "FormsMode" ? (
                                <div className="flex gap-4">
                                    <button className="cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-red-600 hover:text-white text-red-600 px-4 py-1 flex justify-center items-center gap-2 bg-zinc-200/10 rounded-md border border-gray-200" onClick={handleCancel}>Cancelar</button>
                                    <Button onClick={handleSubmit(onSubmit)}>
                                        <FaRegSave size={16} className="mr-2" />
                                        Salvar
                                    </Button>
                                </div>
                            ) : (
                                <button onClick={toFormsMode} className="cursor-pointer transition-all duration-300 hover:text-white hover:bg-blue-950 hover:scale-105 text-blue-950 flex px-4 justify-center items-center gap-2 bg-zinc-200/10 rounded-md py-1 border border-gray-200">
                                    <GoPencil size={16} />
                                    {userDetail?.profiles ? "Editar" : "Adicionar"}
                                </button>
                            )}
                        </div>

                        <div className="mt-6 gap-4 flex flex-col">
                            <div className="flex items-center flex-col">
                                <span className="bg-zinc-300/50 h-24 w-24 flex items-center justify-center rounded-full">
                                    <FaRegUser size={42} className="text-zinc-600" />
                                </span>
                                <p className="flex flex-col mt-2 font-bold text-lg" >{userDetail?.name}</p>
                                <span className="text-zinc-700" >{userDetail?.email}</span>
                            </div>

                            {formsMode === "FormsMode" ? (
                                <form>
                                    <label className="text-black font-medium mt-4 mb-1 sm:text-base text-sm">Curso</label>
                                    <Input
                                        type="text"
                                        placeholder="Ex.: Ciência da Computação"
                                        name="program"
                                        register={register}
                                        error={errors.program?.message}
                                    />
                                    <label className="text-black font-medium mt-4 mb-1 sm:text-base text-sm">Período</label>
                                    <Input
                                        type="number"
                                        placeholder="Ex.: 3"
                                        name="period"
                                        register={register}
                                        error={errors.period?.message}
                                    />
                                    <label className="text-black font-medium mt-4 mb-1 sm:text-base text-sm">Universidade</label>
                                    <Input
                                        type="text"
                                        placeholder="Ex.: UFERSA"
                                        name="university"
                                        register={register}
                                        error={errors.university?.message}
                                    />
                                </form>
                            ) : (
                                <>
                                    <div className="bg-zinc-300/10 rounded-xl px-4 py-2 flex items-center gap-2">
                                        <LuBookOpen size={22} className="text-zinc-800" />
                                        <p className="flex flex-col" >
                                            Curso
                                            {userDetail?.profiles?.program ? (
                                                <span className="font-semibold">{userDetail?.profiles?.program}</span>
                                            ) : (
                                                <span className="text-zinc-500 text-sm">Clique em adicionar e adicine seu curso.</span>)}
                                        </p>
                                    </div>
                                    <div className="bg-zinc-300/10 rounded-xl px-4 py-2 flex items-center gap-2">
                                        <LuCalendar size={22} className="text-zinc-800" />
                                        <p className="flex flex-col" >
                                            Período
                                            {userDetail?.profiles?.period ? (
                                                <span className="font-semibold">{userDetail?.profiles?.period}° Período</span>
                                            ) : (
                                                <span className="text-zinc-500 text-sm">Clique em adicionar e adicine seu período.</span>)}
                                        </p>
                                    </div>
                                    <div className="bg-zinc-300/10 rounded-xl px-4 py-2 flex items-center gap-2">
                                        <FaRegBuilding size={22} className="text-zinc-800" />
                                        <p className="flex flex-col" >
                                            Universidade
                                            {userDetail?.profiles?.university ? (
                                                <span className="font-semibold">{userDetail?.profiles?.university}</span>
                                            ) :
                                                (<span className="text-zinc-500 text-sm">Clique em adicionar e adicine sua universidade.</span>)}
                                        </p>
                                    </div>
                                </>
                            )}

                        </div>
                    </section>
                    <section className="w-full flex-1 ">
                        <div className="flex flex-col gap-4 h-full">

                            <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-semibold">
                                    <LuClock size={24} className="text-blue-950" />
                                </span>
                                <p className="font-bold text-xl mt-2">{secondsToHours(userStats?.totalStudyTime.time)}</p>
                                <span className="text-zinc-500 text-sm">Horas estudadas</span>
                            </div>

                            <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-semibold">
                                    <LuBookOpen size={24} className="text-blue-950" />
                                </span>
                                <p className="font-bold text-xl mt-2">{userStats?.activeCourses}</p>
                                <span className="text-zinc-500 text-sm">Matérias ativas</span>
                            </div>

                            <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-semibold">
                                    <LuTarget size={24} className="text-blue-950" />
                                </span>
                                <p className="font-bold text-xl mt-2">{userStats?.activeGoals}</p>
                                <span className="text-zinc-500 text-sm">Metas ativas</span>
                            </div>

                        </div>
                    </section>

                </div>
            </Container>
        </main>
    )
}
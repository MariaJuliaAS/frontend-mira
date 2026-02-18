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
                <header className="flex flex-col gap-2 sm:gap-4 sm:flex-row sm:items-center sm:justify-between px-2 sm:px-0">
                    <div>
                        <h1 className="font-bold text-xl sm:text-2xl md:text-3xl">Perfil</h1>
                        <span className="text-zinc-500 text-xs sm:text-sm md:text-base">
                            Gerencie suas informações pessoais e acadêmicas
                        </span>
                    </div>
                </header>

                <div className="mt-6 sm:mt-8 md:mt-12 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 min-h-full px-2 sm:px-0">
                    <section className="w-full lg:flex-2 bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                        <div className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                            <h2 className="text-base sm:text-lg font-semibold capitalize flex items-center gap-2">Informações do Usuário</h2>
                            {formsMode === "FormsMode" ? (
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                    <button className="cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-red-600 hover:text-white text-red-600 px-3 sm:px-4 py-2 flex justify-center items-center gap-1 sm:gap-2 bg-zinc-200/10 rounded-md border border-gray-200 text-xs sm:text-sm" onClick={handleCancel}>Cancelar</button>
                                    <Button width="flex-1 sm:flex-none" onClick={handleSubmit(onSubmit)}>
                                        <FaRegSave size={14} className="mr-1 sm:mr-2" />
                                        <span className="py-1">Salvar</span>
                                    </Button>
                                </div>
                            ) : (
                                <button onClick={toFormsMode} className="cursor-pointer transition-all duration-300 hover:text-white hover:bg-blue-950 hover:scale-105 text-blue-950 flex px-3 sm:px-4 justify-center items-center gap-1 sm:gap-2 bg-zinc-200/10 rounded-md py-2 border border-gray-200 text-xs sm:text-sm">
                                    <GoPencil size={14} />
                                    {userDetail?.profiles ? "Editar" : "Adicionar"}
                                </button>
                            )}
                        </div>

                        <div className="mt-6 gap-4 flex flex-col">
                            <div className="flex items-center flex-col">
                                <span className="bg-zinc-300/50 h-20 sm:h-24 w-20 sm:w-24 flex items-center justify-center rounded-full shrink-0">
                                    <FaRegUser size={32} className="sm:w-10 sm:h-10 text-zinc-600" />
                                </span>
                                <p className="flex flex-col mt-3 sm:mt-4 font-bold text-base sm:text-lg text-center" >{userDetail?.name}</p>
                                <span className="text-zinc-700 text-xs sm:text-sm text-center" >{userDetail?.email}</span>
                            </div>

                            {formsMode === "FormsMode" ? (
                                <form className="space-y-4">
                                    <div>
                                        <label className="text-black font-medium mb-2 sm:text-base text-xs block">Curso</label>
                                        <Input
                                            type="text"
                                            placeholder="Ex.: Ciência da Computação"
                                            name="program"
                                            register={register}
                                            error={errors.program?.message}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-black font-medium mb-2 sm:text-base text-xs block">Período</label>
                                        <Input
                                            type="number"
                                            placeholder="Ex.: 3"
                                            name="period"
                                            register={register}
                                            error={errors.period?.message}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-black font-medium mb-2 sm:text-base text-xs block">Universidade</label>
                                        <Input
                                            type="text"
                                            placeholder="Ex.: UFERSA"
                                            name="university"
                                            register={register}
                                            error={errors.university?.message}
                                        />
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="bg-zinc-300/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-3 sm:py-4 flex items-start sm:items-center gap-3">
                                        <LuBookOpen size={18} className="sm:w-5 sm:h-5 text-zinc-800 shrink-0 mt-0.5 sm:mt-0" />
                                        <p className="flex flex-col text-xs sm:text-sm" >
                                            <span className="font-medium text-gray-600">Curso</span>
                                            {userDetail?.profiles?.program ? (
                                                <span className="font-semibold text-gray-900">{userDetail?.profiles?.program}</span>
                                            ) : (
                                                <span className="text-zinc-500 text-xs">Clique em adicionar seu curso.</span>)}
                                        </p>
                                    </div>
                                    <div className="bg-zinc-300/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-3 sm:py-4 flex items-start sm:items-center gap-3">
                                        <LuCalendar size={18} className="sm:w-5 sm:h-5 text-zinc-800 shrink-0 mt-0.5 sm:mt-0" />
                                        <p className="flex flex-col text-xs sm:text-sm" >
                                            <span className="font-medium text-gray-600">Período</span>
                                            {userDetail?.profiles?.period ? (
                                                <span className="font-semibold text-gray-900">{userDetail?.profiles?.period}° Período</span>
                                            ) : (
                                                <span className="text-zinc-500 text-xs">Clique em adicionar seu período.</span>)}
                                        </p>
                                    </div>
                                    <div className="bg-zinc-300/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-3 sm:py-4 flex items-start sm:items-center gap-3">
                                        <FaRegBuilding size={18} className="sm:w-5 sm:h-5 text-zinc-800 shrink-0 mt-0.5 sm:mt-0" />
                                        <p className="flex flex-col text-xs sm:text-sm" >
                                            <span className="font-medium text-gray-600">Universidade</span>
                                            {userDetail?.profiles?.university ? (
                                                <span className="font-semibold text-gray-900">{userDetail?.profiles?.university}</span>
                                            ) :
                                                (<span className="text-zinc-500 text-xs">Clique em adicionar sua universidade.</span>)}
                                        </p>
                                    </div>
                                </>
                            )}

                        </div>
                    </section>
                    <section className="w-full lg:flex-1 ">
                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col gap-3 sm:gap-4 h-full">

                            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-2xl p-3 sm:p-4 shadow-lg flex flex-col items-center justify-center">
                                <span className="flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-blue-100 text-blue-600 font-semibold shrink-0">
                                    <LuClock size={18} className="sm:w-6 sm:h-6 text-blue-950" />
                                </span>
                                <p className="font-bold text-lg sm:text-xl mt-2">{secondsToHours(userStats?.totalStudyTime.time)}</p>
                                <span className="text-zinc-500 text-xs sm:text-sm text-center">Horas estudadas</span>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-2xl p-3 sm:p-4 shadow-lg flex flex-col items-center justify-center">
                                <span className="flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-blue-100 text-blue-600 font-semibold shrink-0">
                                    <LuBookOpen size={18} className="sm:w-6 sm:h-6 text-blue-950" />
                                </span>
                                <p className="font-bold text-lg sm:text-xl mt-2">{userStats?.activeCourses}</p>
                                <span className="text-zinc-500 text-xs sm:text-sm text-center">Matérias ativas</span>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-2xl p-3 sm:p-4 shadow-lg flex flex-col items-center justify-center">
                                <span className="flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-blue-100 text-blue-600 font-semibold shrink-0">
                                    <LuTarget size={18} className="sm:w-6 sm:h-6 text-blue-950" />
                                </span>
                                <p className="font-bold text-lg sm:text-xl mt-2">{userStats?.activeGoals}</p>
                                <span className="text-zinc-500 text-xs sm:text-sm text-center">Metas ativas</span>
                            </div>

                        </div>
                    </section>

                </div>
            </Container>
        </main>
    )
}
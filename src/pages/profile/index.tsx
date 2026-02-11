import { GoPencil } from "react-icons/go";
import { Container } from "../../components/container";
import { useEffect, useState } from "react";
import { api } from "../../service/api";
import { FaRegBuilding, FaRegUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { LuBookOpen, LuCalendar } from "react-icons/lu";

interface UserDetailProps {
    id: string;
    name: string;
    email: string;
    profiles?: {
        university?: string;
        period?: number;
        program?: string;
    }
}

export function Profile() {
    const [userDetail, setUserDetail] = useState<UserDetailProps>();

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

    useEffect(() => {
        fetchUserDetail()
    }, [])

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

                <div className="mt-8 sm:mt-12 flex gap-6 lg:gap-8">
                    <section className="w-full flex-2 bg-white border border-gray-200 rounded-2xl p-4 shadow-lg">
                        <div className="flex w-full justify-between">
                            <h2 className="text-lg font-semibold capitalize flex items-center gap-2">Informações do Usuário</h2>
                            <button className="cursor-pointer transition-all duration-300 hover:text-white hover:bg-blue-950 hover:scale-105 text-blue-950 flex px-4 justify-center items-center gap-2 bg-zinc-200/10 rounded-md py-1 border border-gray-200">
                                <GoPencil size={16} />
                                Editar
                            </button>
                        </div>

                        <div className="mt-6 gap-4 flex flex-col">
                            <div className="flex items-center flex-col">
                                <span className="bg-zinc-300/50 h-24 w-24 flex items-center justify-center rounded-full">
                                    <FaRegUser size={42} className="text-zinc-600" />
                                </span>
                                <p className="flex flex-col mt-2 font-bold text-lg" >{userDetail?.name}</p>
                                <span className="text-zinc-700" >{userDetail?.email}</span>
                            </div>
                            <div className="bg-zinc-300/10 rounded-xl px-4 py-2 flex items-center gap-2">
                                <LuBookOpen size={22} className="text-zinc-800" />
                                <p className="flex flex-col" >
                                    Curso
                                    <span className="font-semibold">{userDetail?.profiles?.program}</span>
                                </p>
                            </div>
                            <div className="bg-zinc-300/10 rounded-xl px-4 py-2 flex items-center gap-2">
                                <LuCalendar size={22} className="text-zinc-800" />
                                <p className="flex flex-col" >
                                    Período
                                    <span className="font-semibold">{userDetail?.profiles?.period}° Período</span>
                                </p>
                            </div>
                            <div className="bg-zinc-300/10 rounded-xl px-4 py-2 flex items-center gap-2">
                                <FaRegBuilding size={22} className="text-zinc-800" />
                                <p className="flex flex-col" >
                                    Universidade
                                    <span className="font-semibold">{userDetail?.profiles?.university}</span>
                                </p>
                            </div>
                        </div>
                    </section>
                    <section className="w-full flex-1 bg-white border border-gray-200 rounded-2xl p-4 shadow-lg">
                        <p>s2</p>
                    </section>
                </div>
            </Container>
        </main>
    )
}
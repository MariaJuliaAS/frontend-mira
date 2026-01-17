import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuGraduationCap, LuLoader } from "react-icons/lu";
import { Input } from "../../components/ui/Input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../service/api";
import { Button } from "../../components/ui/Button";

const schema = z.object({
    email: z.string().email("email inválido").nonempty("o campo email é obrigatório"),
    password: z.string().min(6, "senha deve ter pelo menos 6 caracteres").nonempty("senha é obrigatória")
})
type FormData = z.infer<typeof schema>;

export function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })
    const [viewPass, setViewPass] = useState(true);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function login(data: FormData) {
        try {
            setLoading(true);

            const email = data.email;
            const password = data.password;

            const response = await api.post("/user/login", {
                email,
                password
            })

            localStorage.setItem("@tokenMira", response.data.token);
            navigate("/", { replace: true })
        } catch (err: any) {
            alert("Email ou senha incorretos")
            const message = err.response?.data?.error || "Unexpected error. Try again.";
            console.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-zinc-300/10 w-full h-screen flex flex-col items-center px-24 py-12">

            <div className="mb-6 flex flex-col items-center">
                <p className="flex flex-row items-center font-bold sm:text-3xl text-2xl">
                    <LuGraduationCap className="text-blue-950 mr-2 sm:text-5xl text-4xl" />
                    mira
                </p>
                <span className="text-center">organize seus estudos e acompanhe seu progresso.</span>
            </div>

            <section className="bg-white flex flex-col gap-8 rounded-xl border-2 border-gray-300 shadow-2xl py-8 sm:w-4xs w-96 px-6">
                <div>
                    <p className="text-black font-bold sm:text-2xl text-xl">Bem-vindo de volta</p>
                    <span className="text-zinc-500 sm:text-base text-sm">Entre para continuar sua jornada acadêmica</span>
                </div>

                <form onSubmit={handleSubmit(login)}>
                    <label className="text-black font-medium mb-1 sm:text-base text-sm">Email</label>
                    <Input
                        name="email"
                        type="text"
                        placeholder="seu@email.com"
                        register={register}
                        error={errors.email?.message}
                    />
                    <label className="text-black font-medium mt-4 mb-1 sm:text-base text-sm">Senha</label>
                    <Input
                        name="password"
                        type={viewPass ? "password" : "text"}
                        placeholder="••••••••"
                        register={register}
                        error={errors.password?.message}
                    />
                    <div className="mt-2 mb-3">
                        <input
                            type="checkbox"
                            onClick={() => setViewPass(!viewPass)}
                        />
                        <label className="text-zinc-500 ml-2 sm:text-base text-sm">{viewPass ? "Mostrar" : "Ocultar"} senha</label>
                    </div>
                    <Button disabled={loading} type="submit" width="w-full">
                        {loading ?
                            <LuLoader size={18} color="#fff" className="animate-spin flex items-center justify-center" /> :
                            "Entrar"}
                    </Button>
                </form>

                <p className="text-center sm:text-base text-sm">Não possui conta? <Link to='/register' className="text-blue-950 font-medium underline">Criar conta</Link></p>
            </section>

        </div>
    )
}
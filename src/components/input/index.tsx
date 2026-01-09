import type { RegisterOptions, UseFormRegister } from "react-hook-form";

interface InputPros {
    type: string;
    placeholder: string;
    name: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions;
}

export function Input({ type, placeholder, name, register, error, rules }: InputPros) {
    return (
        <div>
            <input
                className="h-10 rounded-lg border-2 border-gray-200 w-full outline-none px-2"
                type={type}
                placeholder={placeholder}
                id={name}
                {...register(name, rules)}
            />
            {error && <p className="my-1 text-red-500">{error}</p>}
        </div>
    )
}
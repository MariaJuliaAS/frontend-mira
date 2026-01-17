import type { ButtonHTMLAttributes } from "react";
import { LuLoader } from "react-icons/lu";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    width?: string;
}

export function Button({ loading, children, width, ...props }: ButtonProps) {
    return (
        <button
            {...props}
            className={`flex items-center justify-center h-10 ${width} bg-blue-950 rounded-md text-white cursor-pointer px-4 hover:scale-105 transition-all sm:text-base text-sm`}>
            {loading ? (
                <LuLoader
                    size={18} color="#fff" className="animate-spin flex items-center justify-center"
                />
            ) : (
                children
            )}
        </button>
    )
}
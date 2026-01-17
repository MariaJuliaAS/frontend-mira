import type { ReactNode } from "react";
import { LuLoader } from "react-icons/lu";

interface ButtonProps {
    disabled?: boolean;
    loading?: boolean
    type: "button" | "submit" | "reset";
    children: ReactNode;
    width?: string;
}

export function Button({ type, disabled, loading, children, width }: ButtonProps) {
    return (
        <button
            disabled={disabled}
            type={type}
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
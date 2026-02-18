import { FaRegUser } from "react-icons/fa";
import type { UserDetailProps } from "../types/profileTypes";

interface UserDisplayProps {
    user?: UserDetailProps;
}

export function UserDisplay({ user }: UserDisplayProps) {
    return (
        <div className="flex items-center flex-col">
            <span className="bg-zinc-300/50 h-20 sm:h-24 w-20 sm:w-24 flex items-center justify-center rounded-full shrink-0">
                <FaRegUser size={32} className="sm:w-10 sm:h-10 text-zinc-600" />
            </span>
            <p className="flex flex-col mt-3 sm:mt-4 font-bold text-base sm:text-lg text-center">
                {user?.name}
            </p>
            <span className="text-zinc-700 text-xs sm:text-sm text-center">
                {user?.email}
            </span>
        </div>
    );
}

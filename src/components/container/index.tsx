import type { ReactNode } from "react";

interface ContainerProps {
    children: ReactNode;
}

export function Container({ children }: ContainerProps) {
    return (
        <div className="w-full max-w-7xl mx-auto lg:px-4 px-8 py-8">
            {children}
        </div>
    )
}
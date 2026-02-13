interface HeaderPagesProps {
    title: string;
    subTitle?: string;
    children?: React.ReactNode;
}

export function HeaderPages({ title, subTitle, children }: HeaderPagesProps) {
    return (
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="font-bold text-2xl sm:text-3xl">{title}</h1>
                <span className="text-zinc-500 text-sm sm:text-base">
                    {subTitle}
                </span>
            </div>

            {children && <>{children}</>}
        </header>
    )

}
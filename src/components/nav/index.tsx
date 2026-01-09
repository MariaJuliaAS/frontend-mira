import { useEffect, useState, type ReactNode } from "react"
import { Header } from "./header"
import { SideBar } from "./sideBar"

interface NavProps {
    children: ReactNode
}

export function Nav({ children }: NavProps) {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {

        function handleResize() {
            setIsMobile(window.innerWidth < 1024)
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)

    }, [])

    return (
        <div className="flex lg:flex-row flex-col min-h-screen">
            {isMobile ?
                (<Header />)
                :
                (<SideBar />)
            }

            <main className="w-full">
                {children}
            </main>
        </div>
    )

}
"use client"
import { buttonVariants } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/themeToggle"
import { authClient } from "@/lib/auth-client"
import Image from "next/image"
import Link from "next/link"
import { UserDropdown } from "./UserDropdown"

const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    { name: 'Dashboard', href: '/dashboard' },
]

export const Navbar = () => {

    const { data: session, isPending } = authClient.useSession()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
            <div className="container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
                <Link href={`/`} className="flex items-center space-x-2 mr-4">
                    <Image
                        src={`/vercel.svg`}
                        alt="logo"
                        width={10}
                        height={10}
                        className="size-9"
                    />
                    <span className="font-bold">PrajwalLMS</span>
                </Link>

                {/* Desktop Navbar */}
                <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
                    <div className="flex items-center space-x-2">
                        {navigationItems.map((item) => (
                            <Link key={item.name} href={item.href} className="text-sm font-medium transition-colors hover:text-primary">
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-4">
                        <ModeToggle />

                        {isPending ? null : session ? (
                            <UserDropdown email={session.user.email} name={session.user.name} image={session.user.image!}/>
                        ) : (
                            <>
                                <Link href={`/login`} className={buttonVariants({ variant: 'secondary' })}>
                                    Login
                                </Link>

                                <Link href={`/login`} className={buttonVariants()}>
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    )
}
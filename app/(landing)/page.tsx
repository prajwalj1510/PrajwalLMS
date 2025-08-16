// "use client"
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface featuresProps {
    title: string,
    description: string,
    icon: string,
}

const features : featuresProps[] = [
    {
        title: 'Comprehensive Courses',
        description: 'Access a wide range of carefully curated courses designed by industry experts.',
        icon: '📚'
    },
    {
        title: 'Interactive Learning',
        description: 'Engage with interactive content, quizzes, and assignments to enhance your learning experience.',
        icon: '🎮'
    },
    {
        title:'Progress Tracking',
        description:'Moinitor your progress and achievements with detailed analytics and personalized dashboards.',
        icon: '📊'
    },
    {
        title: 'Community Support',
        description: 'Join a vibrant community of learners and instructors to collaborate and share knowledge.',
        icon: '👥',
    }
]

export default function Home() {

    // const router = useRouter()

    // const {
    //     data: session,
    //     // isPending,
    //     // error,
    //     // refetch,
    // } = authClient.useSession()

    // async function signOut() {
    //     await authClient.signOut({
    //         fetchOptions: {
    //             onSuccess: () => {
    //                 router.push('/')
    //                 toast.success('Signed out successfully')
    //             }
    //         }
    //     })
    // }

    return (
        <>
            <section className="relative py-20">
                <div className="flex flex-col items-center text-card space-y-8">
                    <Badge className="py-2" variant='outline'>
                        The future of Online Education
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-muted-foreground">
                        Elevate your Learning Experience
                    </h1>
                    <p className="text-muted-foreground max-w-[700px] md:text-xl">
                        Discover a new way to learn with our modern LMS, interactive learning management system, access high-quality course anytime, anywhere
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Link className={buttonVariants({size: 'lg'})} href='/courses'>
                            Explore courses
                        </Link>

                        <Link className={buttonVariants({size: 'lg', variant: 'secondary'})} href='/login'>
                            Sign in
                        </Link>
                    </div>
                </div>

            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
                {features.map((feature, index) => (
                    <Card className="hover:shadow-lg transition-shadow" key={index}>

                        <CardHeader>
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <CardTitle>{feature.title}</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <p className="text-muted-foreground">
                                {feature.description}
                            </p>
                        </CardContent>

                    </Card>
                ) )}
            </section>
        </>
    )
}

'use client'
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useConfetti } from "@/hooks/use-confetti"
import { CheckIcon, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

const PaymentSuccessPage = () => {

    const { triggerConfetti } = useConfetti()

    useEffect(() => {
        triggerConfetti()
    },[])

    return (
        <div className="w-full min-h-screen flex flex-1 justify-center items-center">
            <Card className="w-[350px]">
                <CardContent>
                    <div className="w-full flex justify-center items-center">
                        <CheckIcon className="size-14 p-3 bg-green-500/30 text-green-500 rounded-full" />
                    </div>

                    <div className="mt-3 text-center sm:mt-5 w-full">
                        <h2 className="text-xl font-semibold">Payment Successfull</h2>
                        <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">
                            Congrats! on your payment. You now have access to course.
                        </p>

                        <Link className={buttonVariants({
                            className: 'w-full mt-5'
                        })} href={`/dashboard`}>
                            <LayoutDashboard className="size-4" />
                            Go to Dashboard
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default PaymentSuccessPage
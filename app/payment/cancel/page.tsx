import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, XIcon } from "lucide-react"
import Link from "next/link"

const PaymentCanceledPage = () => {
    return (
        <div className="w-full min-h-screen flex flex-1 justify-center items-center">
            <Card className="w-[350px]">
                <CardContent>
                    <div className="w-full flex justify-center items-center">
                        <XIcon className="size-14 p-3 bg-red-500/30 text-red-500 rounded-full" />
                    </div>

                    <div className="mt-3 text-center sm:mt-5 w-full">
                        <h2 className="text-xl font-semibold">Payment Cancelled</h2>
                        <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">No worry, you won't be charged. Please Try again!</p>

                        <Link className={buttonVariants({
                            className: 'w-full mt-5'
                        })} href={`/`}>
                            <ArrowLeft className="size-4"/>
                            Go Back to Homepage
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default PaymentCanceledPage
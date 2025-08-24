"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { authClient } from "@/lib/auth-client"
import { Loader } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

export default function VerifyRequestRoute() {
    return (
        <VerifyRequest />
    )
}

function VerifyRequest() {

    const router = useRouter()

    const [otp, setOtp] = useState('')
    const [emailPending, startEmailTransition] = useTransition()
    const params = useSearchParams()
    const email = params.get('email') as string

    const isOtpCompleted = otp.length === 6 ;

    const verifyOtp = () => {
        startEmailTransition(async () => {
            await authClient.signIn.emailOtp({
                email: email,
                otp: otp,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success('Email Verified')
                        router.push('/')
                    },
                    onError: () => {
                        toast.error('Error in verifying email/otp')
                    }
                }
            })
        })
    }

    return (
        <Card className="w-full mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">
                    Please check your email
                </CardTitle>
                <CardDescription>
                    We have sent a email verification code to your email address. Please open the email and paste the code below.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-2">
                    <InputOTP maxLength={6} className="gap-2" value={otp} onChange={(value) => setOtp(value)}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to your email</p>
                </div>

                <Button className="w-full" onClick={verifyOtp} disabled={emailPending || !isOtpCompleted}>
                    {emailPending ? (
                        <>
                            <Loader className="size-4 animate-spin"/>
                            <span>loading...</span>
                        </>
                    ) : (
                        "Verify Account"
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}
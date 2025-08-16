"use client"
import { authClient } from "@/lib/auth-client"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GithubIcon, Loader, SendIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export const LoginForm = () => {

    const router = useRouter()

    const [githubPending, startGithubTransition] = useTransition()
    const [emailPending, startEmailTransition] = useTransition()

    const [email, setEmail] = useState('')

    async function signInWithGitHub() {
        startGithubTransition(async () => {
            await authClient.signIn.social({
                provider: 'github',
                callbackURL: '/',
                fetchOptions: {
                    onSuccess: () => {
                        toast.success('Signed in with Github, you will be redirected...')
                    },
                    onError: (error) => {
                        toast.error('internal server error')
                    }
                }
            })
        })
    }

    async function signInWithEmail() {
        startEmailTransition(async () => {
            await authClient.emailOtp.sendVerificationOtp({
                email: email,
                type: 'sign-in',
                fetchOptions: {
                    onSuccess: () => {
                        toast.success('Email Sent')
                        router.push(`/verify-request?email=${email}`)
                    },
                    onError: () => {
                        toast.error('Error sending email')
                    }
                }
            })
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Welcome Back!</CardTitle>
                <CardDescription>Login with your Github or Email Acc.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Button
                    disabled={githubPending}
                    onClick={signInWithGitHub}
                    className="w-full"
                    variant='outline'
                >
                    {githubPending ? (
                        <>
                            <Loader className="size-5 animate-spin" />
                            <span>loading...</span>
                        </>
                    ) : (
                        <>
                            <GithubIcon className="size-4" />
                            Sign in with GitHub
                        </>
                    )}
                </Button>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
                <div className="grid gap-3">

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="abcd@gmail.com" required/>
                    </div>

                    <Button onClick={signInWithEmail} disabled={emailPending}>
                        {emailPending ? (
                            <>
                                <Loader className="size-4 animate-spin"/>
                                <span>loading...</span>
                            </>
                        ): (
                            <>
                                <SendIcon className="size-4"/>
                                <span>Continue with email</span>
                            </>
                        )}
                    </Button>

                </div>
            </CardContent>
        </Card>
    )
}
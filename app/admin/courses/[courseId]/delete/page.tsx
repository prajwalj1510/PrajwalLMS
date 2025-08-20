'use client';
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";
import Link from "next/link";
import { useTransition } from "react";
import { DeleteCourse } from "./actions";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader, Trash2 } from "lucide-react";


export default function DeleteCourseRoute() {

    const [isPending, startTransition] = useTransition()
    const { courseId } = useParams<{ courseId: string }>()
    const router = useRouter()

    const onSubmit = () => {
        startTransition(async () => {

            const { data: result, error } = await tryCatch(DeleteCourse(courseId))

            if(error) {
                toast.error('An Unexpected error occured. Please try again')
                return;
            }

            if(result.status === 'success') {
                toast.success(result.message)
                router.push('/admin/courses')
            } else if(result.status === 'error') {
                toast.error(result.message)
            }
        })
    }

    return (
        <div className="max-w-xl mx-auto w-full">
            <Card className="mt-32">
                <CardHeader>
                    <CardTitle>
                        Are you sure you want to delete this Course ?
                    </CardTitle>
                    <CardDescription>
                        This action cannot be undone.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <Link className={buttonVariants({
                        variant: 'outline',
                    })} href={`/admin/courses/`}>
                        Cancel
                    </Link>

                    <Button variant='destructive' onClick={onSubmit} disabled={isPending}>
                        {isPending 
                            ? <>
                                <Loader className="size-4 animate-ping"/>
                                Deleting...
                            </> 
                            : <>
                                <Trash2 className="size-4"/>
                                Delete
                            </>
                        }
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
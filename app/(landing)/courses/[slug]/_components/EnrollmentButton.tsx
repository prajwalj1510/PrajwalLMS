'use client';

import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { useTransition } from "react";
import { toast } from "sonner";
import { EnrollInCourseAction } from "../actions";
import { Loader, Loader2 } from "lucide-react";

export const EnrollmentButton = ({ courseId }: { courseId: string }) => {

    const [isPending, startTransition] = useTransition()

    const onSubmit = () => {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(EnrollInCourseAction(courseId))

            if (error) {
                toast.error('An unexpected error occured. Please try again')
                return;
            }

            if (result.status === 'success') {
                toast.success(result.message)
            } else if (result.status === 'error') {
                toast.error(result.message)
            }
        })
    }

    return (
        <Button className="w-full" onClick={onSubmit} disabled={isPending}>
            {isPending ? (
                <>
                    <Loader className="size-4 animate-spin"/>
                    Loading...
                </>
            ) : (
                'Enroll Now!'
            )}
        </Button>
    )
}


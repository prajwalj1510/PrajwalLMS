import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { tryCatch } from "@/hooks/try-catch"
import { Loader, Trash2 } from "lucide-react"
import { useState, useTransition } from "react"
import { deleteChapter } from "../actions"
import { toast } from "sonner"

export const DeleteChapter = ({
    chapterId,
    courseId
}: { chapterId: string, courseId: string }) => {

    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const onSubmit = async () => {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(deleteChapter({
                chapterId, courseId
            }))

            if (error) {
                toast.error('An unexpected error occured. Please try again')
                return;
            }

            if (result.status === 'success') {
                toast.success(result.message)
                setOpen(false)
            } else if (result.status === 'error') {
                toast.error(result.message)
            }
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant='ghost' size='icon'>
                    <Trash2 className="size-4" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely Sure ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {" "}
                        This Action is irreversible. This will permanently delete this chapter.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={onSubmit} disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader className="size-5 animate-spin" />
                                Deleting...
                            </>
                        ) : 'Delete'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
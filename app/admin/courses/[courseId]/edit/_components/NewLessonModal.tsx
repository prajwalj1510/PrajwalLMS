import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { tryCatch } from "@/hooks/try-catch"
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { BookOpen, Loader, Loader2Icon, PlusIcon } from "lucide-react"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { CreateLesson } from "../actions"
import { toast } from "sonner"

export const NewLessonModal = ({ courseId, chapterId }: { courseId: string, chapterId: string }) => {

    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const form = useForm<LessonSchemaType>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            name: '',
            courseId: courseId,
            chapterId: chapterId,
        }
    })

    const onSubmit = async (values: LessonSchemaType) => {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(CreateLesson(values))

            if (error) {
                toast.error('An unexpected error occured. Please try again')
                return;
            }

            if (result.status === 'success') {
                toast.success(result.message)
                form.reset()
                setIsOpen(false)
            } else if (result.status === 'error') {
                toast.error(result.message)
            }
        })
    }

    const handleOpenChange = (open: boolean) => {
        if(!open) {
            form.reset()
        }
        setIsOpen(open)
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant='outline' className="gap-2 w-full justify-center">
                    <PlusIcon className="size-4" /> New Lesson
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        Create a new lesson
                    </DialogTitle>
                    <DialogDescription>
                        What would you like to name your lesson?
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Lesson Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button disabled={isPending} type="submit">
                                {isPending ? (
                                    <>
                                        <Loader className="size-4 animate-spin" />
                                        Creating a lesson...
                                    </>
                                ) : (
                                    <>
                                        <BookOpen className="size-4" />
                                        Create a lesson
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}


"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DndContext, DragEndEvent, DraggableSyntheticListeners, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { ReactNode, useEffect, useState } from "react"


import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, FileTextIcon, GripVertical } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { reorderChapters, reorderLessons } from "../actions"
import { NewChapterModal } from "./NewChapterModal"
import { NewLessonModal } from "./NewLessonModal"
import { DeleteLesson } from "./DeleteLesson"
import { DeleteChapter } from "./DeleteChapter"

interface CourseStructureProps {
    data: AdminCourseSingularType
}

interface SortableItemProps {
    id: string,
    children: (listeners: DraggableSyntheticListeners) => ReactNode,
    className?: string,
    data?: {
        type: 'chapter' | 'lesson',
        chapterId?: string, // only relevant for lessons
    }
}

export const CourseStructure = ({ data }: CourseStructureProps) => {

    const initialItems = data.chapter.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        order: chapter.position,
        isOpen: true, // Default chapters to open
        lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.position,
        }))
    })) || []; // Empty chapters

    // const [items, setItems] = useState(['1', '2', '3'])
    const [items, setItems] = useState(initialItems)

    console.log(items);

    useEffect(() => {
        setItems((prevItems) => {
            const updatedItems = data.chapter.map((chapter) => ({
                id: chapter.id,
                title: chapter.title,
                order: chapter.position,
                isOpen: prevItems.find((item) => item.id === chapter.id)?.isOpen ?? true,
                lessons: chapter.lessons.map((lesson) => ({
                    id: lesson.id,
                    title: lesson.title,
                    order: lesson.position,
                })),
            })) || [];

            return updatedItems
        })
    }, [data])

    function SortableItem({ id, children, className, data }: SortableItemProps) {

        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging
        } = useSortable({
            id: id,
            data: data,
            transition: {
                duration: 150, // milliseconds
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
            },
        });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        return (
            <div ref={setNodeRef} style={style} {...attributes} className={cn('touch-none', className, isDragging ? 'z-10' : '')}>
                {children(listeners)}
            </div>
        );
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        // if (active.id !== over.id) {
        //     setItems((items) => {
        //         const oldIndex = items.indexOf(active.id);
        //         const newIndex = items.indexOf(over.id);

        //         return arrayMove(items, oldIndex, newIndex);
        //     });
        // }

        if (!over || active.id === over.id) {
            return;
        }

        const activeId = active.id
        const overId = over.id

        const activeType = active.data.current?.type as "chapter" | "lesson";
        const overType = over.data.current?.type as "chapter" | "lesson";

        const courseId = data.id

        if (activeType === 'chapter') {
            let targetChapterId = null;

            if (overType === 'chapter') {
                targetChapterId = overId
            } else if (overType === 'lesson') {
                targetChapterId = over.data.current?.chapterId ?? null
            }

            if (!targetChapterId) {
                toast.error('Could not determine the chapter for re-ordering')
                return
            }

            const oldIndex = items.findIndex((item) => item.id === activeId) // original position
            const newIndex = items.findIndex((item) => item.id === targetChapterId) // new position

            if (oldIndex === -1 || newIndex === -1) {
                toast.error('Could not find chapter old/new index for re-ordering')
                return
            }

            const reorderedLocalChapters = arrayMove(items, oldIndex, newIndex)

            const updatedChaptersForState = reorderedLocalChapters.map((chapter, index) => ({
                ...chapter,
                order: index + 1,
            }))

            const prevoiusItems = [...items]

            setItems(updatedChaptersForState)

            if (courseId) {

                const chaptersToUpdate = updatedChaptersForState.map((chapter) => ({
                    id: chapter.id,
                    position: chapter.order,
                }))

                const reorderChapterPromise = () => reorderChapters(courseId, chaptersToUpdate)

                toast.promise(reorderChapterPromise(), {
                    loading: 'Reordering Chapters...',
                    success: (result) => {
                        if (result.status === 'success') {
                            return result.message;
                        }
                        throw new Error(result.message)
                    },
                    error: () => {
                        setItems(prevoiusItems);
                        return `Failed to reorder chapters.`
                    }

                })
            }
            return;
        }

        if (activeType === 'lesson' && overType === 'lesson') {
            const chapterId = active.data.current?.chapterId
            const overChapterId = over.data.current?.chapterId

            if (!chapterId || chapterId !== overChapterId) {
                toast.error('Lesson move between different chapters or invalid chapter ID is not allowed')
                return;
            }

            const chapterIndex = items.findIndex((chapter) => chapter.id === chapterId)

            if (chapterIndex === -1) {
                toast.error('Could not find chapter for lesson')
                return;
            }

            const chapterToUpdate = items[chapterIndex]

            const oldLessonIndex = chapterToUpdate.lessons.findIndex((lesson) => lesson.id === activeId)

            const newLessonIndex = chapterToUpdate.lessons.findIndex((lesson) => lesson.id === overId)

            if (oldLessonIndex === -1 || newLessonIndex === -1) {
                toast.error('Could not find lesson for reordering')
                return;
            }

            const reorderedLessons = arrayMove(chapterToUpdate.lessons, oldLessonIndex, newLessonIndex)

            const updatedLessonForState = reorderedLessons.map((lesson, index) => ({
                ...lesson,
                order: index + 1,
            }))

            const newItems = [...items]

            newItems[chapterIndex] = {
                ...chapterToUpdate,
                lessons: updatedLessonForState,
            }

            const previousItems = [...items]

            setItems(newItems)

            if (courseId) {
                const lessonsToUpdate = updatedLessonForState.map((lesson) => ({
                    id: lesson.id,
                    position: lesson.order,
                }))

                const reorderLessonsPromise = () => reorderLessons(chapterId, lessonsToUpdate, courseId)

                toast.promise(reorderLessonsPromise(), {
                    loading: 'Reordering Lessons...',
                    success: (result) => {
                        if (result.status === 'success') return result.message
                        throw new Error(result.message)
                    },
                    error: () => {
                        setItems(previousItems)
                        return 'Failed to reorder lessons'
                    }
                })

            }

            return;
        }
    }

    const toggleChapter = (chapterId: string) => {
        setItems(
            items.map((chapter) => chapter.id === chapterId ? { ...chapter, isOpen: !chapter.isOpen } : chapter)
        )
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd} sensors={sensors}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b border-border">
                    <CardTitle>
                        Chapters
                    </CardTitle>
                    <NewChapterModal courseId={data.id} />
                </CardHeader>

                <CardContent className="space-y-8">
                    <SortableContext strategy={verticalListSortingStrategy} items={items}>
                        {
                            items.map((item) => (
                                <SortableItem id={item.id} data={{ type: 'chapter' }} key={item.id}>
                                    {(listeners) => (
                                        <Card>
                                            <Collapsible open={item.isOpen} onOpenChange={() => toggleChapter(item.id)}>
                                                <div className="flex items-center justify-between p-3 border-b border-border">
                                                    <div className="flex items-center gap-2">
                                                        <Button size='icon' variant='ghost' type="button" className="cursor-grab opacity-60 hover:opacity-100" {...listeners}>
                                                            <GripVertical className="size-4" />
                                                        </Button>
                                                        <CollapsibleTrigger asChild>
                                                            <Button size='icon' type="button" className="flex items-center" variant='ghost'>
                                                                {item.isOpen ? (
                                                                    <ChevronDown className="size-4" />
                                                                ) : (
                                                                    <ChevronRight className="size-4" />
                                                                )}
                                                            </Button>
                                                        </CollapsibleTrigger>
                                                        <p className="cursor-pointer hover:text-primary pl-2">{item.title}</p>
                                                    </div>
                                                    {/* <Button size='icon' variant='ghost'>
                                                        <Trash2 className="size-4" />
                                                    </Button> */}
                                                    <DeleteChapter chapterId={item.id} courseId={data.id} />
                                                </div>

                                                <CollapsibleContent>
                                                    <div className="p-1">
                                                        <SortableContext items={item.lessons.map((lesson) => lesson.id)} strategy={verticalListSortingStrategy}>
                                                            {item.lessons.map((lesson) => (
                                                                <SortableItem
                                                                    key={lesson.id}
                                                                    id={lesson.id}
                                                                    data={{ type: 'lesson', chapterId: item.id }}
                                                                >
                                                                    {(lessonListeners) => (
                                                                        <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                                                            <div className="flex items-center gap-2">
                                                                                <Button variant='ghost' size='icon' {...lessonListeners}>
                                                                                    <GripVertical className="size-4" />
                                                                                </Button>
                                                                                <FileTextIcon className="size-4" />
                                                                                <Link href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}>
                                                                                    {lesson.title}
                                                                                </Link>
                                                                            </div>
                                                                            {/* <Button variant='outline' size='icon'>
                                                                                <Trash2 className="size-4" />
                                                                            </Button> */}

                                                                            <DeleteLesson chapterId={item.id} courseId={data.id} lessonId={lesson.id} />
                                                                        </div>
                                                                    )}
                                                                </SortableItem>
                                                            ))}
                                                        </SortableContext>
                                                        <div className="p-2">
                                                            <NewLessonModal chapterId={item.id} courseId={data.id} />
                                                        </div>
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        </Card>
                                    )}
                                </SortableItem>
                            ))
                        }
                    </SortableContext>
                </CardContent>
            </Card>


        </DndContext>
    )
}
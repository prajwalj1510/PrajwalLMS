"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DndContext, DraggableSyntheticListeners, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { ReactNode, useState } from "react"


import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, ChevronUp, FileTextIcon, GripVertical, Trash2 } from "lucide-react"
import Link from "next/link"

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

    function handleDragEnd(event) {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
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
                </CardHeader>

                <CardContent>
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
                                                    <Button size='icon' variant='ghost'>
                                                        <Trash2 className="size-4" />
                                                    </Button>
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
                                                                                <FileTextIcon className="size-4"/>
                                                                                <Link href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}>
                                                                                    {lesson.title}
                                                                                </Link>
                                                                            </div>
                                                                            <Button variant='outline' size='icon'>
                                                                                <Trash2 className="size-4"/>
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                </SortableItem>
                                                            ))}
                                                        </SortableContext>
                                                        <div className="p-2">
                                                            <Button variant='outline' className="w-full">
                                                                Create New Lesson
                                                            </Button>
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
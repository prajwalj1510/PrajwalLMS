"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet"
import { prisma } from "@/lib/db"
import { ApiResponse } from "@/lib/types"
import { chapterSchema, ChapterSchemaType, courseSchema, CourseSchemaType, lessonSchema, LessonSchemaType } from "@/lib/zodSchema"
import { request } from "@arcjet/next"
import { revalidatePath } from "next/cache"

const aj = arcjet.withRule(
    detectBot({
        mode: 'LIVE',
        allow: [],
    })
).withRule(
    fixedWindow({
        mode: 'LIVE',
        window: '1m',
        max: 5,
    })
)

export async function editCourse(data: CourseSchemaType, courseId: string): Promise<ApiResponse> {
    const user = await requireAdmin()

    try {
        const req = await request()
        const decision = await aj.protect(req, {
            fingerprint: user.user.id
        })

        if (decision.isDenied()) {
            // return {
            //     status: 'error',
            //     message: 'Looks like you are a malicious user'
            // }

            if (decision.reason.isRateLimit()) {
                return {
                    status: 'error',
                    message: 'You have been blocked due to rate limiting',
                }
            } else {
                return {
                    status: 'error',
                    message: 'You are a bot!. If this is a mistake contact our support'
                }
            }
        }

        const result = courseSchema.safeParse(data)

        if (!result) {
            return {
                status: 'error',
                message: 'Invalid data'
            }
        }

        await prisma.course.update({
            where: {
                id: courseId,
                userId: user.user.id
            },
            data: {
                ...result.data,
            }
        })

        return {
            status: 'success',
            message: 'Course updated successfully'
        }

    } catch {
        return {
            status: 'error',
            message: 'Failed to update course'
        }
    }
}

export async function reorderLessons(
    chapterId: string,
    lessons: { id: string, position: number, }[],
    courseId: string,
): Promise<ApiResponse> {

    await requireAdmin()

    try {

        if (!lessons || lessons.length === 0) {
            return {
                status: 'error',
                message: 'No Lessons provided for reordering',
            }
        }

        const updates = lessons.map((lesson) => prisma.lesson.update({
            where: {
                id: lesson.id,
                chapterId: chapterId,
            },
            data: {
                position: lesson.position
            }
        }))

        await prisma.$transaction(updates)

        revalidatePath(`/admin/courses/${courseId}/edit`)

        return {
            status: 'success',
            message: 'Lessons reordered successfully'
        }

    } catch {
        return {
            status: 'error',
            message: 'Failed to reorder lesson'
        }
    }
}

export async function reorderChapters(
    courseId: string,
    chapters: { id: string, position: number }[],
): Promise<ApiResponse> {

    await requireAdmin()

    try {

        if (!chapters || chapters.length === 0) {
            return {
                status: 'error',
                message: ' No chapters provided for reordering'
            }
        }

        const updates = chapters.map((chapter) => prisma.chapter.update({
            where: {
                id: chapter.id,
                courseId: courseId,
            },
            data: {
                position: chapter.position,
            }
        }))

        await prisma.$transaction(updates)

        revalidatePath(`/admin/courses/${courseId}/edit`)

        return {
            status: 'success',
            message: 'Chapters reordered successfully'
        }

    } catch {

        return {
            status: 'error',
            message: 'Failed to reorder chapters'
        }

    }
}

export async function CreateChapter(values: ChapterSchemaType): Promise<ApiResponse> {

    await requireAdmin()

    try {

        const result = chapterSchema.safeParse(values)

        if (!result.success) {
            return {
                status: 'error',
                message: 'Invalid Data',
            }
        }

        await prisma.$transaction(async (ctx) => {
            const maxPos = await ctx.chapter.findFirst({
                where: {
                    courseId: result.data.courseId,
                },
                select: {
                    position: true,
                },
                orderBy: {
                    position: 'desc',
                }
            });

            await ctx.chapter.create({
                data: {
                    title: result.data.name,
                    courseId: result.data.courseId,
                    position: (maxPos?.position ?? 0) + 1,
                }
            })
        })

        revalidatePath(`/admin/courses/${result.data.courseId}/edit`)

        return {
            status: 'success',
            message: 'Chapter created successfully'
        }

    } catch {
        return {
            status: 'error',
            message: 'Failed to create chapter',
        }
    }
}

export async function CreateLesson(values: LessonSchemaType): Promise<ApiResponse> {

    await requireAdmin()

    try {

        const result = lessonSchema.safeParse(values)

        if (!result.success) {
            return {
                status: 'error',
                message: 'Invalid Data',
            }
        }

        await prisma.$transaction(async (ctx) => {
            const maxPos = await ctx.lesson.findFirst({
                where: {
                    chapterId: result.data.chapterId,
                },
                select: {
                    position: true,
                },
                orderBy: {
                    position: 'desc',
                }
            });

            await ctx.lesson.create({
                data: {
                    title: result.data.name,
                    description: result.data.description,
                    videoKey: result.data.videoKey,
                    thumbnailKey: result.data.thumbnailKey,
                    chapterId: result.data.chapterId,
                    position: (maxPos?.position ?? 0) + 1,
                }
            })
        })

        revalidatePath(`/admin/courses/${result.data.courseId}/edit`)

        return {
            status: 'success',
            message: 'Lesson created successfully'
        }

    } catch {
        return {
            status: 'error',
            message: 'Failed to create lesson',
        }
    }
}

export async function deleteLesson({
    chapterId,
    courseId,
    lessonId
}: { chapterId: string, courseId: string, lessonId: string }): Promise<ApiResponse> {

    await requireAdmin()

    try {

        const chapterWithLessons = await prisma.chapter.findUnique({
            where: {
                id: chapterId,
            },
            select: {
                lessons: {
                    orderBy: {
                        position: 'asc',
                    },
                    select: {
                        id: true,
                        position: true,
                    }
                }
            }
        })

        if (!chapterWithLessons) {
            return {
                status: 'error',
                message: 'Chapter not found'
            }
        }

        const lessons = chapterWithLessons.lessons

        const lessonToDelete = lessons.find((lesson) => lesson.id === lessonId)

        if (!lessonToDelete) {
            return {
                status: 'error',
                message: 'Lesson not found in the chapter'
            }
        }

        const remainingLessons = lessons.filter((lesson) => lesson.id !== lessonId)

        const updates = remainingLessons.map((lesson, index) => {
            return prisma.lesson.update({
                where: {
                    id: lesson.id,
                },
                data: {
                    position: index + 1,
                }
            })
        })

        await prisma.$transaction([
            ...updates,
            prisma.lesson.delete({
                where: {
                    id: lessonId,
                    chapterId: chapterId,
                }
            })
        ])

        revalidatePath(`/admin/courses/${courseId}/edit`)

        return {
            status: 'success',
            message: 'Lesson deleted & positions reordered successfully',
        }

    } catch {
        return {
            status: 'error',
            message: 'Failed to delete lesson',
        }
    }
}

export async function deleteChapter({
    chapterId,
    courseId,
}: { chapterId: string, courseId: string }): Promise<ApiResponse> {

    await requireAdmin()

    try {

        const courseWithChapters = await prisma.course.findUnique({
            where: {
                id: courseId,
            },
            select: {
                chapter: {
                    orderBy: {
                        position: 'asc',
                    },
                    select: {
                        id: true,
                        position: true
                    }
                }
            }
        })

        if (!courseWithChapters) {
            return {
                status: 'error',
                message: 'Course not found'
            }
        }

        const chapters = courseWithChapters.chapter

        const chapterToDelete = chapters.find((chapter) => chapter.id === chapterId)

        if (!chapterToDelete) {
            return {
                status: 'error',
                message: 'Chapter not found in the course'
            }
        }

        const remainingChapters = chapters.filter((chapter) => chapter.id !== chapterId)

        const updates = remainingChapters.map((chapter, index) => {
            return prisma.chapter.update({
                where: {
                    id: chapter.id,
                },
                data: {
                    position: index + 1,
                }
            })
        })

        await prisma.$transaction([
            ...updates,
            prisma.chapter.delete({
                where: {
                    id: chapterId,
                }
            })
        ])

        revalidatePath(`/admin/courses/${courseId}/edit`)

        return {
            status: 'success',
            message: 'Chapter deleted & positions reordered successfully',
        }

    } catch {
        return {
            status: 'error',
            message: 'Failed to delete chapter',
        }
    }
}
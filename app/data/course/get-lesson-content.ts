import 'server-only';
import { RequireUser } from '../user/require-user';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export const GetLessonContent = async (lessonId: string) => {

    const session = await RequireUser()

    const lesson = await prisma.lesson.findUnique({
        where: {
            id: lessonId,
        },
        select: {
            id: true,
            title: true,
            description: true,
            thumbnailKey: true,
            videoKey: true,
            position:true,
            lessonProgress: {
                where: {
                    userId: session.id,
                },
                select: {
                    completed: true,
                    lessonId: true,
                },
            },
            Chapter: {
                select: {
                    courseId: true,
                    Course: {
                        select: {
                            slug: true,
                        }
                    }
                }
            }
        }
    })

    if(!lesson) {
        return notFound()
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: session.id,
                courseId: lesson.Chapter.courseId,
            }
        },
        select: {
            status: true,
        }
    })

    if(!enrollment || enrollment.status !== 'Active') {
        return notFound()
    }

    return lesson
}

export type GetLessonContentType = Awaited<ReturnType<typeof GetLessonContent>>
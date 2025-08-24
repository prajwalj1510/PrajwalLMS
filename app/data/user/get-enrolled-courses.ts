import 'server-only';
import { RequireUser } from './require-user';
import { prisma } from '@/lib/db';

export const GetEnrolledCourses = async () => {
    const user = await RequireUser()

    const data = await prisma.enrollment.findMany({
        where: {
            userId: user.id,
            status: 'Active',
        },
        select: {
            Course: {
                select: {
                    id: true,
                    smallDescription: true,
                    title: true,
                    fileKey: true,
                    level: true,
                    slug: true,
                    duration: true,
                    chapter: {
                        select: {
                            id: true,
                            lessons: {
                                select: {
                                    id: true,
                                    lessonProgress: {
                                        where: {
                                            userId: user.id,
                                        },
                                        select: {
                                            id: true,
                                            completed: true,
                                            lessonId: true,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    return data;
}

export type EnrolledCourseType = Awaited<ReturnType<typeof GetEnrolledCourses>>[0]
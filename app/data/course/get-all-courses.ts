import { prisma } from "@/lib/db"

export const GetAllCourses = async () => {

    // await new Promise((resolve) => setTimeout(resolve, 2000))

    const data = await prisma.course.findMany({
        where: {
            status: "Published",
        },
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            title: true,
            price: true,
            smallDescription: true,
            slug: true,
            fileKey: true,
            id: true,
            level: true,
            duration: true,
            category: true,
        }
    })

    return data;
}

export type PublicCourseType = Awaited<ReturnType<typeof GetAllCourses>>[0]
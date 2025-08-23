import 'server-only'

import { prisma } from "@/lib/db"
import { requireAdmin } from "./require-admin"

export const AdminGetEnrollmentStats = async () => {
    await requireAdmin()

    const thirtyDaysAgo = new Date() 

    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const enrollmentsData = await prisma.enrollment.findMany({
        where: {
            createdAt: {
                gte: thirtyDaysAgo,
            }
        },
        select: {
            createdAt: true,
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    const lastThirtyDays: {date: string, enrollments: number}[] = []

    for (let i = 29; i >= 0; i--) {

        const date = new Date()

        date.setDate(date.getDate() - i)
        
        lastThirtyDays.push({
            date: date.toISOString().split('T')[0],
            enrollments: 0,
        })
    }

    enrollmentsData.forEach((enrollment) => {
        const enrollmentDate = enrollment.createdAt.toISOString().split('T')[0]
        const dayIndex = lastThirtyDays.findIndex((day) => day.date === enrollmentDate)

        if(dayIndex !== -1){
            lastThirtyDays[dayIndex].enrollments++ ;
        }  
    })

    return lastThirtyDays
}
'use server';

import { RequireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const MarkLessonComplete = async (lessonId: string, slug: string): Promise<ApiResponse> => {
    const session = await RequireUser()

    try {

        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: session.id,
                    lessonId: lessonId,
                }
            },
            update: {
                completed: true,
            },
            create: {
                lessonId: lessonId,
                userId: session.id,
                completed: true,
            }
        })

        revalidatePath(`/dashboard/${slug}`)

        return {
            status:'success',
            message: 'Progress updated'
        }

    } catch {
        return {
            status: 'error',
            message: 'Failed to mark lesson as complete'
        }
    }
}
'use server';

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

// const aj = arcjet.withRule(
//     detectBot({
//         mode: 'LIVE',
//         allow: [],
//     })
// ).withRule(
//     fixedWindow({
//         mode: 'LIVE',
//         window: '1m',
//         max: 5,
//     })
// )

const aj = arcjet.withRule(
    fixedWindow({
        mode: 'LIVE',
        window: '1m',
        max: 5,
    })
)


export const DeleteCourse = async (courseId: string): Promise<ApiResponse> => {
    const session = await requireAdmin()

    try {

        const req = await request()
        const decision = await aj.protect(req, {
            fingerprint: session.user.id,
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

        await prisma.course.delete({
            where: {
                id: courseId,
            }
        })

        revalidatePath(`/admin/courses`)

        return {
            status: 'success',
            message: 'Course deleted successfully',
        }

    } catch (error) {
        console.log(error);

        return {
            status: 'error',
            message: 'Failed to delete course'
        }
    }
} 
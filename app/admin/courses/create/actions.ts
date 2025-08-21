"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchema";
import { request } from "@arcjet/next";
import { headers } from "next/headers";

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

export const CreateCourse = async (values: CourseSchemaType): Promise<ApiResponse> => {

    const session = await requireAdmin()

    try {
        const req = await request()
        const decision = await aj.protect(req, {
            fingerprint: session.user.id,
        })

        if(decision.isDenied()) {
            // return {
            //     status: 'error',
            //     message: 'Looks like you are a malicious user'
            // }

            if(decision.reason.isRateLimit()) {
                return {
                    status:'error',
                    message: 'You have been blocked due to rate limiting',
                }
            } else {
                return {
                    status: 'error',
                    message: 'You are a bot!. If this is a mistake contact our support'
                }
            }
        }

        const validation = courseSchema.safeParse(values)

        if (!validation.success) {
            return {
                status: 'error',
                message: 'Invalid Form Data',
            }
        }

        const data = await prisma.course.create({
            data: {
                ...validation.data,
                userId: session?.user.id as string,
            }
        })

        return {
            status: 'success',
            message: 'Course created successfully',
        }

    } catch (error) {
        console.log(error);

        return {
            status: 'error',
            message: 'Failed to create course',
        }
    }
}
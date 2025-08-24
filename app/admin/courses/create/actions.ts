"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchema";
import { request } from "@arcjet/next";

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

        const validation = courseSchema.safeParse(values)

        if (!validation.success) {
            return {
                status: 'error',
                message: 'Invalid Form Data',
            }
        }

        const stripeData = await stripe.products.create({
            name: validation.data.title,
            description: validation.data.smallDescription,
            default_price_data: {
                currency: 'inr',
                unit_amount: validation.data.price * 100,
            }
        })

        await prisma.course.create({
            data: {
                ...validation.data,
                userId: session?.user.id as string,
                stripePriceId: stripeData.default_price as string,
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
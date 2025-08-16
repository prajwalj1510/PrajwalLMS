import { z } from "zod";

export const courseLevel = ['Beginner','Intermediate', 'Advanced'] as const

export const courseStatus = ['Draft', 'Published', 'Archived'] as const

export const courseCategories = [
    'Development',
    'Business',
    'Finance',
    'IT & Software',
    'OFFICE Productivity',
    'Personal Development',
    'Design',
    'Marketing',
    'Health & Fitness',
    'Music',
    'Teaching & Academics'
] as const

export const courseSchema = z.object({
    title: z.string().min(3, {message: 'Title must be atleast 3 characters long'}).max(100, {message: 'Title must be atmost 100 characters long...'}),
    description: z.string().min(3, {message: 'Description must be atleast 3 characters long...'}),
    fileKey: z.string().min(1, {message: 'File is required'}),
    price: z.number().min(1, {message: 'Price must be a positive number'}),
    duration: z.number().min(1, {message: 'Duration must be atleast 1 hour'}).max(500, {message: 'Duration must be atmost 500 hours'}),
    level: z.enum(courseLevel, {message: 'Level is required'}),
    category: z.enum(courseCategories, {message: 'Course Category is required'}),
    smallDescription: z.string().min(3, {message: 'Small description must be atleast 3 characters long'}).max(200,{message: 'Small description must be atmost 200 charecters long...'} ),
    slug: z.string().min(3, {message: 'Slug must be atleast 3 characters long...'}),
    status: z.enum(courseStatus, {message: 'Status is required'}),
})

export type CourseSchemaType = z.infer<typeof courseSchema>
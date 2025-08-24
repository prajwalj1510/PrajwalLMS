import { GetLessonContent } from "@/app/data/course/get-lesson-content"
import { CourseContent } from "./_components/CourseContent"
import { Suspense } from "react"
import { LessonSkeleton } from "./_components/LessonSkeleton"

type Params = Promise<{
    lessonId: string
}>

const LessonContentPage = async ({ params }: { params: Params }) => {

    const { lessonId } = await params

    const data = await GetLessonContent(lessonId)

    return <Suspense fallback={<LessonSkeleton />}> 
        <LessonContentLoader lessonId={lessonId} />
    </Suspense>
}

export default LessonContentPage

async function LessonContentLoader({ lessonId }: { lessonId: string }) {
    const data = await GetLessonContent(lessonId)

    return (
        <CourseContent data={data} />
    )
}
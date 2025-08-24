import { GetCourseSidebarData } from "@/app/data/course/get-course-sidebar-data"
import { redirect } from "next/navigation"

interface CourseSlugRouteProps {
  params: Promise<{
    slug: string,
  }>,
}

const CourseSlugRoute = async ({ params }: CourseSlugRouteProps) => {

  const { slug } = await params

  const course = await GetCourseSidebarData(slug)

  const firstChapter = course.course.chapter[0]
  const firstLesson = firstChapter.lessons[0]

  if(firstLesson) {
    redirect(`/dashboard/${slug}/${firstLesson.id}`)
  }

  return (
    <div className="flex items-center justify-center h-full text-center">
      <h2 className="text-2xl font-bold mb-2">No lessons avaliable</h2>
      <p className="text-muted-foreground">This course does not have any lesson yet!</p>
    </div>
  )
}

export default CourseSlugRoute
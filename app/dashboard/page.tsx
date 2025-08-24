import { EmptyState } from "@/components/general/EmptyState"
import { GetAllCourses } from "../data/course/get-all-courses"
import { GetEnrolledCourses } from "../data/user/get-enrolled-courses"
import { PublicCourseCard } from "../(landing)/_components/PublicCourseCard"
import { CourseProgressCard } from "./_components/CourseProgressCard"

export default async function DashboardPage() {

  const [courses, enrolledCourses] = await Promise.all([
    GetAllCourses(),
    GetEnrolledCourses()
  ])

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Enrolled Courses</h1>
        <p className="text-muted-foreground">
          Here you can see all the courses you have access to
        </p>
      </div>

      {enrolledCourses.length === 0 ? (
        <EmptyState
          title="No Courses purchased"
          description="You have not purchased any courses yet!"
          buttonText="Browse Courses"
          href="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <CourseProgressCard key={course.Course.id} data={course}/>
            ))}
        </div>
      )}

      <section className="mt-10">
        <div className="flex flex-col gap-2 mb-5">
          <h1 className="text-3xl font-bold">Avaliable Courses</h1>
          <p className="text-muted-foreground">
            Here you can see all the courses you can purchase
          </p>
        </div>

        {courses.filter(
          (course) =>
            !enrolledCourses.some(
              ({ Course: enrolled }) => enrolled.id === course.id
            )
        ).length === 0 ? (
          <EmptyState
            title="No Courses Avaliable"
            description="You have already purchases all avaliable courses"
            buttonText="Browse courses"
            href="/courses"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {
                courses.filter(
                  (course) => !enrolledCourses.some(
                    ({Course: enrolled}) => enrolled.id === course.id
                  )
                ).map((course) => (
                  <PublicCourseCard key={course.id} data={course}/>
                ))
              }
          </div>
        )
        }

      </section>

    </>
  )
}

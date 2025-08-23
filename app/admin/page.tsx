import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { AdminGetEnrollmentStats } from "../data/admin/admin-get-enrollment-stats";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { AdminGetRecentCourses } from "../data/admin/admin-get-recent-courses";
import { EmptyState } from "@/components/general/EmptyState";
import { AdminCourseCard, AdminCourseCardSkeleton } from "./courses/_components/AdminCourseCard";
import { Suspense } from "react";

export default async function AdminIndexPage() {

  const enrollmentData = await AdminGetEnrollmentStats()

  return (
    <>
      <SectionCards />
      <ChartAreaInteractive data={enrollmentData} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold hover:text-pink-400">
            Recent Courses
          </h2>
          <Link className={buttonVariants({
            variant: 'outline'
          })} href={`/admin/courses`}>
            View all Courses
          </Link>
        </div>

        <Suspense fallback={<RenderRecentCoursesSkeletonLayout/>}>
          <RenderRecentCourses />
        </Suspense>

      </div>
    </>
  )
}

async function RenderRecentCourses() {
  const data = await AdminGetRecentCourses()

  if (data.length === 0) {
    return (
      <EmptyState
        buttonText="Create new Course"
        description="You don't have any courses. Create some to see them here"
        title="You don't have any courses yet!"
        href="/admin/courses/create"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((course) => (
        <AdminCourseCard key={course.id} data={course} />
      ))}
    </div>
  )
}

export const RenderRecentCoursesSkeletonLayout = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({length: 5}).map((_, index) => (
        <AdminCourseCardSkeleton key={index}/>
      ))}
    </div>
  )
}
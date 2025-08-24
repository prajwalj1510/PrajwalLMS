import { ReactNode } from "react";
import { CourseSidebar } from "../_components/CourseSidebar";
import { GetCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";

interface CourseLayoutProps {
    params: Promise<{
        slug: string,
    }>,
    children: ReactNode
}

export default async function CourseLayout({ params, children }: CourseLayoutProps) {

    const { slug } = await params

    // server-side security check and lightweight data fetching
    const course = await GetCourseSidebarData(slug)

    return (
        <div className="flex flex-1">
            {/* Sidebar - 30% */}

            <div className="w-80 border-r border-border shrink-0">
                <CourseSidebar course={course.course} />
            </div>

            {/* Main content - 70% */}
            <div className="flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    )
}
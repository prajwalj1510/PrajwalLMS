import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function CoursesPage() {
    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Your Courses</h1>

                <Link className={buttonVariants()} href={`/admin/courses/create`}>
                    Create a Course
                </Link>
            </div>

            <div>
                <h1>Display Courses</h1>
            </div>
        </>
    )
}
import { AdminCourseType } from "@/app/data/admin/admin-get-courses"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useConstructUrl } from "@/hooks/use-construct-url"
import { ArrowRight, Eye, MoreVertical, Pencil, SchoolIcon, TimerIcon, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface AdminCourseCardProps {
    data: AdminCourseType
}

export const AdminCourseCard = ({ data }: AdminCourseCardProps) => {

    const thumbnailUrl = useConstructUrl(data.fileKey)

    return (
        <Card className="group relative py-0 gap-y-0">
            {/* Absolute dropdrown */}
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='secondary' size='icon'>
                            <MoreVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${data.id}/edit`}>
                                <Pencil className="size-4 mr-2" />
                                Edit
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${data.slug}`}>
                                <Eye className="size-4 mr-2" />
                                Preview
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${data.id}/delete`}>
                                <Trash2 className="size-4 mr-2 text-destructive" />
                                Delete
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Image
                src={thumbnailUrl}
                alt="Thumbnail url"
                width={600}
                height={400}
                className="w-full rounded-lg aspect-video h-full object-cover"
            />

            <CardContent className="p-4">
                <Link
                    href={`/admin/courses/${data.id}`}
                    className="text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
                >
                    {data.title}
                </Link>

                <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
                    {data.smallDescription}
                </p>

                <div className="mt-4 flex items-center gap-x-5">
                    <div className="flex items-center gap-x-2">
                        <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                        <p className="text-sm text-muted-foreground">
                            {data.duration}h
                        </p>
                    </div>

                    <div className="flex items-center gap-x-2">
                        <SchoolIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                        <p className="text-sm text-muted-foreground">
                            {data.level}
                        </p>
                    </div>
                </div>

                <Link
                    href={`/admin/courses/${data.id}/edit`}
                    className={buttonVariants({
                        className: 'w-full mt-4'
                    })}
                >
                    Edit Course <ArrowRight className="size-4" />
                </Link>
            </CardContent>
        </Card>
    )
}

// https://newprajwal.t3.storageapi.dev/4b1c7078-a4b5-44fe-ba97-6b8430dbc83a-photo.jpg

export const AdminCourseCardSkeleton = () => {
    return (
        <Card className="group relative gap-y-0 py-0">
            <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                <Skeleton className="h-6 w-16 rounded-full"/>
                <Skeleton className="size-8 rounded-md"/>
            </div>
            <div className="w-full relative h-fit">
                <Skeleton className="w-full rounded-lg aspect-video h-[250px] object-cover"/>
            </div>
            <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2 rounded"/>
                <Skeleton className="h-4 w-full mb-4 rounded"/>

                <div className="mt-4 flex items-center gap-x-5">
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-6 rounded-md"/>
                        <Skeleton className="h-4 w-10 rounded"/>
                    </div>

                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-6 rounded-md"/>
                        <Skeleton className="h-4 w-10 rounded"/>
                    </div>
                </div>

                <Skeleton className="mt-4 h-10 w-full rounded"/>
            </CardContent>
        </Card> 
    )
}
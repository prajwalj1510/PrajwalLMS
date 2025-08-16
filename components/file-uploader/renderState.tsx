import { cn } from "@/lib/utils"
import { CloudUploadIcon, ImageIcon } from "lucide-react"
import { Button } from "../ui/button"

export const RenderEmptyState = ({ isDragActive }: { isDragActive: boolean }) => {
    return (
        <div className="text-center">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
                <CloudUploadIcon className={cn(
                    'size-6 text-muted-foreground',
                    isDragActive && 'text-primary'
                )} />
            </div>

            <p className="text-base font-semibold text-foreground">
                Drop your files here or {" "}
                <span className="text-primary font-bold cursor-pointer">
                    Click to Upload
                </span>
            </p>
            <Button className="mt-4" type="button">
                Select File
            </Button>
        </div>
    )
}

export const RenderErrorState = () => {
    return (
        <div className="text-center">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
                <ImageIcon className={cn(
                    'size-6 text-destructive',
                )} />
            </div>

            <p className="text-base font-semibold">Upload failed</p>
            <p className="mt-1 text-xs text-muted-foreground">Something went wrong</p>

            <Button className="mt-4 rounded-full" type="button">
                Retry File Selection
            </Button>
        </div>
    )
}
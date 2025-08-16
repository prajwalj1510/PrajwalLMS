import { type Editor } from "@tiptap/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, Bold, BoldIcon, Heading1Icon, Heading2Icon, Heading3Icon, ItalicIcon, ListIcon, ListOrderedIcon, RedoIcon, StrikethroughIcon, UndoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface MenubarProps {
    editor: Editor | null;
}

export const Menubar = ({ editor }: MenubarProps) => {

    if (!editor) return null;

    console.log(editor.isActive('bold'));


    return (
        <div className="border border-input rounded-t-lg p-2 bg-card flex flex-wrap gap-2 items-center border-t-0 border-x-0">
            <TooltipProvider>
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size='sm'
                                pressed={editor.isActive("bold")}
                                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                                className={cn(
                                    editor.isActive("bold") && 'bg-muted text-muted-foreground'
                                )}
                            >

                                <BoldIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Bold
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size='sm'
                                pressed={editor.isActive('italic')}
                                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                                className={cn(
                                    editor.isActive('italic') && 'bg-muted text-muted-foreground'
                                )}
                            >

                                <ItalicIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Italic
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size='sm'
                                pressed={editor.isActive('strike')}
                                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                                className={cn(
                                    editor.isActive('strike') && 'bg-muted text-muted-foreground'
                                )}
                            >

                                <StrikethroughIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Strike
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size='sm'
                                pressed={editor.isActive('heading', { level: 1 })}
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                className={cn(
                                    editor.isActive('heading', { level: 1 }) && 'bg-muted text-muted-foreground'
                                )}
                            >

                                <Heading1Icon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Heading 1
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size='sm'
                                pressed={editor.isActive('heading', { level: 2 })}
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                className={cn(
                                    editor.isActive('heading', { level: 2 }) && 'bg-muted text-muted-foreground'
                                )}
                            >

                                <Heading2Icon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Heading 2
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size='sm'
                                pressed={editor.isActive('heading', { level: 3 })}
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                className={cn(
                                    editor.isActive('heading', { level: 3 }) && 'bg-muted text-muted-foreground'
                                )}
                            >

                                <Heading3Icon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Heading 3
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size='sm'
                                pressed={editor.isActive('bulletList')}
                                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                                className={cn(
                                    editor.isActive('bulletList') && 'bg-muted text-muted-foreground'
                                )}
                            >

                                <ListIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Bullest List
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size='sm'
                                pressed={editor.isActive('orderedList')}
                                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                                className={cn(
                                    editor.isActive('orderedList') && 'bg-muted text-muted-foreground'
                                )}
                            >

                                <ListOrderedIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Ordered List
                        </TooltipContent>
                    </Tooltip>

                </div>

                <div className="w-px h-6 bg-border mx-2 flex">
                </div>

                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size='sm'
                                pressed={editor.isActive({ textAlign: 'left' })}
                                onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                                className={cn(
                                    editor.isActive({ textAlign: 'left' }) && 'bg-muted text-muted-foreground'
                                )}
                            >

                                <AlignLeftIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Align Left
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size='sm'
                                pressed={editor.isActive({ textAlign: 'center' })}
                                onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                                className={cn(
                                    editor.isActive({ textAlign: 'center' }) && 'bg-muted text-muted-foreground'
                                )}
                            >

                                <AlignCenterIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Align Center
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size='sm'
                                pressed={editor.isActive({ textAlign: 'right' })}
                                onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
                                className={cn(
                                    editor.isActive({ textAlign: 'right' }) && 'bg-muted text-muted-foreground'
                                )}
                            >

                                <AlignRightIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Align Right
                        </TooltipContent>
                    </Tooltip>
                </div>

                <div className="w-px h-6 bg-border mx-2" />

                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                size='sm' 
                                variant='ghost' 
                                type="button"
                                onClick={() => editor.chain().focus().undo().run()}
                                disabled={!editor.can().undo()}
                            >
                                <UndoIcon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Undo
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                size='sm' 
                                variant='ghost' 
                                type="button"
                                onClick={() => editor.chain().focus().redo().run()}
                                disabled={!editor.can().redo()}
                            >
                                <RedoIcon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Redo
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </div>
    )
}

'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Menubar } from './Menubar'
import TextAlign from '@tiptap/extension-text-align'

export const Tiptap = ({field}:{field: any}) => {
  const editor = useEditor({
    extensions: [StarterKit, 
        TextAlign.configure({
            types: ['heading', 'paragraph']
        })
    ],
    editorProps: {
        attributes: {
            class: 'min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none'
        }
    },

    onUpdate: ({editor}) => {
        field.onChange(JSON.stringify(editor.getJSON()))
    },

    content: field.value ? JSON.parse(field.value) : '<p>Hello world</p>',
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  })

//   return <EditorContent editor={editor} />
return (
    <div className='w-full border border-input rounded-lg overflow-hidden dark:bg-input/30 '>
        <Menubar editor={editor}/>
        <EditorContent editor={editor}/>
    </div>
)
}
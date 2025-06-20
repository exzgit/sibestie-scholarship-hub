'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'

import { Bold, Italic, Underline as UnderlineIcon, ImageIcon, Link2, List, ListOrdered, Heading } from 'lucide-react'
import { Button } from "@/components/ui/button"
import clsx from 'classnames'

export function RichTextEditor({ content, onChange }: { content: string, onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, Image, Link, Underline],
    content,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert min-h-[200px] max-w-full focus:outline-none p-4',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return null

  const insertImage = () => {
    const url = window.prompt('Masukkan URL gambar')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }

  const insertLink = () => {
    const url = window.prompt('Masukkan URL')
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }

  const ToolbarButton = ({ icon: Icon, action, isActive }: { icon: any, action: () => void, isActive?: boolean }) => (
    <Button
      variant="ghost"
      size="sm"
      className={clsx("rounded-md", { "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300": isActive })}
      onClick={action}
    >
      <Icon size={18} />
    </Button>
  )

  return (
    <div className="border rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
        <ToolbarButton icon={Bold} action={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} />
        <ToolbarButton icon={Italic} action={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} />
        <ToolbarButton icon={UnderlineIcon} action={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} />
        <ToolbarButton icon={Heading} action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} />
        <ToolbarButton icon={List} action={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} />
        <ToolbarButton icon={ListOrdered} action={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} />
        <ToolbarButton icon={ImageIcon} action={insertImage} />
        <ToolbarButton icon={Link2} action={insertLink} isActive={editor.isActive('link')} />
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}

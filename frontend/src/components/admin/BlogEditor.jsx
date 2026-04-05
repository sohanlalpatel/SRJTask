import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function TiptapEditor({ value, setValue }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "<p>Start writing your blog...</p>",
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="bg-[#020617] border border-[#c0cee5] rounded flex flex-col">
      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-2 p-2 border-b border-[#1e293b]">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="btn"
        >
        
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="btn"
        >
          I
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="btn"
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className="btn"
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="btn"
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="btn"
        >
          1. List
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className="btn"
        >
          P
        </button>
      </div>

      {/* EDITOR */}
      <EditorContent
        editor={editor}
        className="p-4 h-[300px] overflow-y-auto text-white outline-none"
      />
    </div>
  );
}

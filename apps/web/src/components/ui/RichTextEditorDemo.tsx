import { useState, useRef } from 'react';
import { RichTextEditor, RichTextEditorRef } from './RichTextEditor';

export const RichTextEditorDemo = () => {
  const [content, setContent] = useState(
    '<p>Try this new rich text editor!</p>'
  );
  const editorRef = useRef<RichTextEditorRef>(null);

  const handleChange = (value: string) => {
    setContent(value);
  };

  const handleGetContent = () => {
    if (editorRef.current) {
      alert(editorRef.current.getHTML());
    }
  };

  const handleClearContent = () => {
    if (editorRef.current) {
      editorRef.current.clearContent();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Rich Text Editor</h2>

      <RichTextEditor
        ref={editorRef}
        label="Content Editor"
        value={content}
        onChange={handleChange}
        placeholder="Start typing..."
        maxLength={1000}
        className="w-full"
      />

      <div className="flex gap-4">
        <button
          onClick={handleGetContent}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Get Content
        </button>

        <button
          onClick={handleClearContent}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Clear Content
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-2">HTML Output:</h3>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-40">
          {content}
        </pre>
      </div>
    </div>
  );
};

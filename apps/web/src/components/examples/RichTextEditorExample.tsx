import { useState, useRef } from 'react';
import { RichTextEditor, RichTextEditorRef } from '../ui/RichTextEditor';

export const RichTextEditorExample = () => {
  const [content, setContent] = useState(
    '<p>Welcome to the new rich text editor!</p>'
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Rich Text Editor</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <RichTextEditor
          ref={editorRef}
          label="Document Content"
          value={content}
          onChange={handleChange}
          placeholder="Start typing your content here..."
          maxLength={2000}
        />

        <div className="mt-6 flex gap-4">
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
      </div>

      <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium mb-4">HTML Output:</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60 text-sm">
          {content}
        </pre>
      </div>
    </div>
  );
};

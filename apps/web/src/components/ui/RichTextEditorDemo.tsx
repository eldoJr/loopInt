import { useState } from 'react';
import { RichTextEditor } from './RichTextEditor';

export const RichTextEditorDemo = () => {
  const [content, setContent] = useState('# Rich Text Editor Demo\n\nThis is a **bold text** and *italic text*.\n\n## Features\n\n- Bullet list item 1\n- Bullet list item 2\n\n1. Numbered list item 1\n2. Numbered list item 2\n\n> This is a quote\n\n`inline code`\n\n[Link example](https://example.com)\n\n![Image example](https://via.placeholder.com/150)');
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Rich Text Editor</h2>
      
      <RichTextEditor
        label="Document Content"
        initialValue={content}
        onChange={setContent}
        placeholder="Start typing..."
        required
      />
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Raw Markdown</h3>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-sm">
          {content}
        </pre>
      </div>
    </div>
  );
};

export default RichTextEditorDemo;
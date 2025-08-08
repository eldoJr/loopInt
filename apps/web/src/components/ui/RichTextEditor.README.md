# Rich Text Editor Component

A lightweight, dependency-free rich text editor for the loopInt platform.

## Features

- Modern WYSIWYG editing experience
- No external dependencies (uses browser's contenteditable)
- Support for formatting (bold, italic, underline)
- Headings (H1, H2)
- Lists (bullet and ordered)
- Blockquotes
- Links
- Images
- Text alignment
- Undo/redo functionality
- Preview mode
- Character count with optional limit
- Fully customizable with CSS

## Usage

```tsx
import { RichTextEditor } from './components/ui/RichTextEditor';
import { useRef } from 'react';
import type { RichTextEditorRef } from './components/ui/RichTextEditor';

function MyComponent() {
  const [content, setContent] = useState('<p>Initial content</p>');
  const editorRef = useRef<RichTextEditorRef>(null);

  const handleChange = (value: string) => {
    setContent(value);
    // Do something with the HTML content
  };

  return (
    <RichTextEditor
      ref={editorRef}
      label="Document Content"
      value={content}
      onChange={handleChange}
      placeholder="Start typing..."
      maxLength={2000}
      className="w-full"
    />
  );
}
```

## Props

| Prop           | Type                      | Description                           |
| -------------- | ------------------------- | ------------------------------------- |
| `label`        | `string`                  | Optional label for the editor         |
| `error`        | `string`                  | Optional error message                |
| `required`     | `boolean`                 | Whether the field is required         |
| `onChange`     | `(value: string) => void` | Callback when content changes         |
| `value`        | `string`                  | Controlled value (HTML string)        |
| `initialValue` | `string`                  | Initial value when uncontrolled       |
| `placeholder`  | `string`                  | Placeholder text when editor is empty |
| `className`    | `string`                  | Additional CSS classes                |
| `maxLength`    | `number`                  | Optional character limit              |

## Ref Methods

The component exposes these methods via ref:

| Method           | Description                  |
| ---------------- | ---------------------------- |
| `getContent()`   | Get the current HTML content |
| `getHTML()`      | Alias for getContent()       |
| `focus()`        | Focus the editor             |
| `clearContent()` | Clear all content            |

## Styling

The component includes a basic CSS file (`RichTextEditor.css`) that provides styling for:

- Placeholder text
- Editor content area
- Blockquotes
- Headings
- Lists
- Links
- Images

You can customize the styles by modifying this CSS file.

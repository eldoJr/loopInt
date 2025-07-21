import { useState, useRef, useEffect, forwardRef } from 'react';
import { 
  Bold, Italic, Code, List, ListOrdered, Quote, Link, Image, Undo, Redo, 
  Search, Copy, Download, Upload, AlignLeft, AlignCenter, AlignRight, 
  AlignJustify, Type, Eye, AlertCircle
} from 'lucide-react';

interface TextState {
  content: string;
  selection: { start: number; end: number };
}

interface RichTextEditorProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'> {
  label?: string;
  error?: string;
  required?: boolean;
  onChange?: (value: string) => void;
  value?: string;
  initialValue?: string;
  showPreview?: boolean;
  maxHistoryStates?: number;
  maxLength?: number;
}

export const RichTextEditor = forwardRef<HTMLTextAreaElement, RichTextEditorProps>(
  ({ 
    label, 
    error, 
    required, 
    className = '', 
    onChange, 
    value, 
    initialValue = '', 
    showPreview = true,
    maxHistoryStates = 50,
    maxLength,
    ...props 
  }, ref) => {
    // Track if changes are internal to prevent infinite loops
    const isInternalChange = useRef(false);
    
    const [content, setContent] = useState(value !== undefined ? value : initialValue);
    const [fontSize, setFontSize] = useState(16);
    const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [replaceText, setReplaceText] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
    const [stats, setStats] = useState({ words: 0, chars: 0, lines: 0 });
    
    // History management
    const [history, setHistory] = useState<TextState[]>([{ 
      content: value !== undefined ? value : initialValue, 
      selection: { start: 0, end: 0 } 
    }]);
    const [historyIndex, setHistoryIndex] = useState(0);
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Update content when value prop changes (external change)
    useEffect(() => {
      if (value !== undefined && value !== content && !isInternalChange.current) {
        setContent(value);
        // Update history when value changes externally
        if (textareaRef.current) {
          const selection = {
            start: textareaRef.current.selectionStart,
            end: textareaRef.current.selectionEnd
          };
          const newHistory = [...history, { content: value, selection }];
          if (newHistory.length > maxHistoryStates) {
            newHistory.shift();
          }
          setHistory(newHistory);
          setHistoryIndex(newHistory.length - 1);
        }
      }
      // Reset the flag after each render
      isInternalChange.current = false;
    }, [value]);
    
    // Update stats when content changes
    useEffect(() => {
      const words = content.trim() ? content.trim().split(/\s+/).length : 0;
      const chars = content.length;
      const lines = content.split('\n').length;
      setStats({ words, chars, lines });
      
      // Only call onChange for internal changes
      if (onChange && isInternalChange.current) {
        onChange(content);
      }
    }, [content, onChange]);

    // Internal update function that sets the flag
    const updateContent = (newContent: string) => {
      isInternalChange.current = true;
      setContent(newContent);
      
      if (textareaRef.current) {
        const selection = {
          start: textareaRef.current.selectionStart,
          end: textareaRef.current.selectionEnd
        };
        
        // Only add to history if content changed
        if (history[historyIndex]?.content !== newContent) {
          const newHistory = history.slice(0, historyIndex + 1);
          newHistory.push({ content: newContent, selection });
          
          // Limit history size
          if (newHistory.length > maxHistoryStates) {
            newHistory.shift();
          }
          
          setHistory(newHistory);
          setHistoryIndex(newHistory.length - 1);
        }
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateContent(e.target.value);
    };

    const handleUndo = () => {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        isInternalChange.current = true;
        setContent(history[newIndex].content);
        
        // Restore selection after state update
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = history[newIndex].selection.start;
            textareaRef.current.selectionEnd = history[newIndex].selection.end;
            textareaRef.current.focus();
          }
        }, 0);
      }
    };

    const handleRedo = () => {
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        isInternalChange.current = true;
        setContent(history[newIndex].content);
        
        // Restore selection after state update
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = history[newIndex].selection.start;
            textareaRef.current.selectionEnd = history[newIndex].selection.end;
            textareaRef.current.focus();
          }
        }, 0);
      }
    };

    const insertFormat = (before: string, after: string = '') => {
      if (!textareaRef.current) return;
      
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      
      const newContent = 
        content.substring(0, start) + 
        before + 
        selectedText + 
        after + 
        content.substring(end);
      
      updateContent(newContent);
      
      // Set cursor position after formatting
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start + before.length;
        textarea.selectionEnd = start + before.length + selectedText.length;
      }, 0);
    };

    const formatBold = () => insertFormat('**', '**');
    const formatItalic = () => insertFormat('*', '*');
    const formatCode = () => insertFormat('`', '`');
    
    const formatBulletList = () => {
      if (!textareaRef.current) return;
      
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      
      // Format each line with bullet
      const formattedText = selectedText
        .split('\n')
        .map(line => line.trim() ? `- ${line}` : line)
        .join('\n');
      
      const newContent = 
        content.substring(0, start) + 
        formattedText + 
        content.substring(end);
      
      updateContent(newContent);
    };
    
    const formatNumberedList = () => {
      if (!textareaRef.current) return;
      
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      
      // Format each line with numbers
      const lines = selectedText.split('\n').filter(line => line.trim());
      const formattedText = lines
        .map((line, i) => `${i + 1}. ${line}`)
        .join('\n');
      
      const newContent = 
        content.substring(0, start) + 
        formattedText + 
        content.substring(end);
      
      updateContent(newContent);
    };
    
    const formatQuote = () => {
      if (!textareaRef.current) return;
      
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      
      // Format each line with quote
      const formattedText = selectedText
        .split('\n')
        .map(line => line.trim() ? `> ${line}` : line)
        .join('\n');
      
      const newContent = 
        content.substring(0, start) + 
        formattedText + 
        content.substring(end);
      
      updateContent(newContent);
    };
    
    const formatLink = () => {
      if (!textareaRef.current) return;
      
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      
      const linkText = selectedText || 'link text';
      const formattedText = `[${linkText}](url)`;
      
      const newContent = 
        content.substring(0, start) + 
        formattedText + 
        content.substring(end);
      
      updateContent(newContent);
      
      // Position cursor at the url part
      setTimeout(() => {
        textarea.focus();
        const urlStart = start + linkText.length + 3;
        textarea.selectionStart = urlStart;
        textarea.selectionEnd = urlStart + 3;
      }, 0);
    };
    
    const formatImage = () => {
      if (!textareaRef.current) return;
      
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      
      const formattedText = '![alt text](image-url)';
      
      const newContent = 
        content.substring(0, start) + 
        formattedText + 
        content.substring(start);
      
      updateContent(newContent);
      
      // Position cursor at the image-url part
      setTimeout(() => {
        textarea.focus();
        const urlStart = start + 11;
        textarea.selectionStart = urlStart;
        textarea.selectionEnd = urlStart + 9;
      }, 0);
    };

    const handleCopyToClipboard = () => {
      if (!textareaRef.current) return;
      
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // Copy selected text or all content if nothing is selected
      const textToCopy = start !== end 
        ? content.substring(start, end) 
        : content;
      
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          console.log('Copied to clipboard');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    };

    const handleDownload = () => {
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target?.result as string;
        updateContent(fileContent);
      };
      reader.readAsText(file);
      
      // Reset the input
      e.target.value = '';
    };

    const handleSearch = () => {
      if (!textareaRef.current || !searchText) return;
      
      const textarea = textareaRef.current;
      const currentPos = textarea.selectionEnd;
      const searchIndex = content.indexOf(searchText, currentPos);
      
      if (searchIndex !== -1) {
        textarea.focus();
        textarea.selectionStart = searchIndex;
        textarea.selectionEnd = searchIndex + searchText.length;
      }
    };

    const handleReplace = () => {
      if (!textareaRef.current || !searchText) return;
      
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // Only replace if the current selection matches the search text
      if (content.substring(start, end) === searchText) {
        const newContent = 
          content.substring(0, start) + 
          replaceText + 
          content.substring(end);
        
        updateContent(newContent);
        
        // Position cursor after the replaced text
        setTimeout(() => {
          textarea.focus();
          textarea.selectionStart = start + replaceText.length;
          textarea.selectionEnd = start + replaceText.length;
        }, 0);
      }
    };

    const handleReplaceAll = () => {
      if (!searchText) return;
      
      const newContent = content.split(searchText).join(replaceText);
      updateContent(newContent);
    };

    // Simple Markdown to HTML converter for preview
    const markdownToHtml = (markdown: string) => {
      let html = markdown
        // Convert headers
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        // Convert bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Convert italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Convert code
        .replace(/`(.*?)`/g, '<code>$1</code>')
        // Convert links
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
        // Convert images
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" />')
        // Convert bullet lists
        .replace(/^\s*- (.*$)/gm, '<li>$1</li>')
        // Convert numbered lists
        .replace(/^\s*\d+\. (.*$)/gm, '<li>$1</li>')
        // Convert quotes
        .replace(/^\s*> (.*$)/gm, '<blockquote>$1</blockquote>')
        // Convert paragraphs
        .replace(/\n\n/g, '</p><p>')
        // Convert line breaks
        .replace(/\n/g, '<br />');
      
      // Wrap in paragraph if not already
      if (!html.startsWith('<h') && !html.startsWith('<p>')) {
        html = `<p>${html}</p>`;
      }
      
      return html;
    };
    
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 p-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-lg">
          {/* Text formatting */}
          <button 
            type="button" 
            onClick={formatBold}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button 
            type="button" 
            onClick={formatItalic}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button 
            type="button" 
            onClick={formatCode}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            title="Code"
          >
            <Code size={16} />
          </button>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
          
          {/* Lists */}
          <button 
            type="button" 
            onClick={formatBulletList}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button 
            type="button" 
            onClick={formatNumberedList}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
          
          {/* Quote, Link, Image */}
          <button 
            type="button" 
            onClick={formatQuote}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            title="Quote"
          >
            <Quote size={16} />
          </button>
          <button 
            type="button" 
            onClick={formatLink}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            title="Link"
          >
            <Link size={16} />
          </button>
          <button 
            type="button" 
            onClick={formatImage}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            title="Image"
          >
            <Image size={16} />
          </button>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
          
          {/* Text alignment */}
          <button 
            type="button" 
            onClick={() => setTextAlign('left')}
            className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${textAlign === 'left' ? 'bg-gray-200 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300'}`}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => setTextAlign('center')}
            className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${textAlign === 'center' ? 'bg-gray-200 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300'}`}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => setTextAlign('right')}
            className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${textAlign === 'right' ? 'bg-gray-200 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300'}`}
            title="Align Right"
          >
            <AlignRight size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => setTextAlign('justify')}
            className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${textAlign === 'justify' ? 'bg-gray-200 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300'}`}
            title="Justify"
          >
            <AlignJustify size={16} />
          </button>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
          
          {/* Font size */}
          <div className="flex items-center">
            <Type size={16} className="mr-1 text-gray-700 dark:text-gray-300" />
            <select 
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="bg-transparent text-gray-700 dark:text-gray-300 text-sm border-none focus:ring-0 p-0"
            >
              {[10, 12, 14, 16, 18, 20, 22, 24].map(size => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
          </div>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
          
          {/* Undo/Redo */}
          <button 
            type="button" 
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${historyIndex <= 0 ? 'opacity-50 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300'}`}
            title="Undo"
          >
            <Undo size={16} />
          </button>
          <button 
            type="button" 
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${historyIndex >= history.length - 1 ? 'opacity-50 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300'}`}
            title="Redo"
          >
            <Redo size={16} />
          </button>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
          
          {/* Search */}
          <button 
            type="button" 
            onClick={() => setShowSearch(!showSearch)}
            className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${showSearch ? 'bg-gray-200 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300'}`}
            title="Search and Replace"
          >
            <Search size={16} />
          </button>
          
          {/* Copy, Download, Upload */}
          <button 
            type="button" 
            onClick={handleCopyToClipboard}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            title="Copy to Clipboard"
          >
            <Copy size={16} />
          </button>
          <button 
            type="button" 
            onClick={handleDownload}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            title="Download as Markdown"
          >
            <Download size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            title="Upload File"
          >
            <Upload size={16} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleUpload}
            accept=".md,.txt,.html"
            className="hidden"
          />
          
          {showPreview && (
            <>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
              
              {/* Preview toggle */}
              <button 
                type="button" 
                onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
                className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${showMarkdownPreview ? 'bg-gray-200 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300'}`}
                title="Toggle Preview"
              >
                <Eye size={16} />
              </button>
            </>
          )}
        </div>
        
        {/* Search and Replace */}
        {showSearch && (
          <div className="flex flex-col sm:flex-row gap-2 p-2 bg-gray-100 dark:bg-gray-800 border-x border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="Replace with..."
                className="w-full px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm"
              />
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={handleSearch}
                className="px-2 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800/30 text-sm"
              >
                Find
              </button>
              <button
                type="button"
                onClick={handleReplace}
                className="px-2 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800/30 text-sm"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleReplaceAll}
                className="px-2 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800/30 text-sm"
              >
                Replace All
              </button>
            </div>
          </div>
        )}
        
        {/* Editor and Preview */}
        <div className={`${showMarkdownPreview && showPreview ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}`}>
          {/* Text Editor */}
          <div className={`${showMarkdownPreview && showPreview ? '' : 'block'} w-full pr-4`}>
            <textarea
              ref={(node) => {
                // Handle both the forwarded ref and our internal ref
                if (typeof ref === 'function') {
                  ref(node);
                } else if (ref) {
                  ref.current = node;
                }
                textareaRef.current = node;
              }}
              value={content}
              onChange={handleChange}
              maxLength={maxLength}
              className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border ${!showSearch ? 'rounded-t-none' : ''} rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                error
                  ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50'
                  : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50 focus:border-blue-500/50'
              } ${className}`}
              style={{ 
                fontSize: `${fontSize}px`,
                textAlign,
                minHeight: '200px',
                resize: 'vertical'
              }}
              {...props}
            />
          </div>
          
          {/* Markdown Preview */}
          {showMarkdownPreview && showPreview && (
            <div className="w-full pr-4">
              <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 overflow-auto" style={{ minHeight: '200px' }}>
                <div 
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Error message */}
        {error && (
          <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </div>
        )}
        
        {/* Stats bar */}
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 px-1">
          <div className="flex space-x-3">
            <span>{stats.words} words</span>
            <span className={maxLength && stats.chars > maxLength * 0.9 ? 'text-red-500 dark:text-red-400' : ''}>
              {stats.chars}{maxLength ? `/${maxLength}` : ''} characters
            </span>
            <span>{stats.lines} lines</span>
          </div>
          <div>
            <span>History: {historyIndex + 1}/{history.length}</span>
          </div>
        </div>
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';
import { useState, useRef, useEffect, forwardRef, useCallback, memo } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, Quote, Link, Image, Undo, Redo, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Heading1, Heading2, Eye, EyeOff
} from 'lucide-react';
import './RichTextEditor.css';

interface RichTextEditorProps {
  label?: string;
  error?: string;
  required?: boolean;
  onChange?: (value: string) => void;
  value?: string;
  initialValue?: string;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  showPreview?: boolean;
}

export interface RichTextEditorRef {
  getContent: () => string;
  getHTML: () => string;
  focus: () => void;
  clearContent: () => void;
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ 
    label, 
    error, 
    required, 
    className = '', 
    onChange, 
    value, 
    initialValue = '', 
    placeholder = 'Write something...',
    maxLength,
    showPreview: initialShowPreview = false
  }, ref) => {
    const [showPreview, setShowPreview] = useState(initialShowPreview);
    const [charCount, setCharCount] = useState(0);
    const [activeFormats, setActiveFormats] = useState({
      bold: false,
      italic: false,
      underline: false,
      h1: false,
      h2: false,
      ul: false,
      ol: false,
      blockquote: false,
      alignLeft: false,
      alignCenter: false,
      alignRight: false,
      alignJustify: false
    });
    const editorRef = useRef<HTMLDivElement>(null);
    const isInternalChange = useRef(false);
    const lastCaretPosition = useRef<number | null>(null);

    // Define functions early to avoid reference errors
    const getContent = () => {
      return editorRef.current?.innerHTML || '';
    };

    const updateCharCount = useCallback(() => {
      if (editorRef.current) {
        // Strip HTML tags to count only visible text
        const text = editorRef.current.textContent || '';
        setCharCount(text.length);
      }
    }, []);

    // Check active formats when selection changes
    const checkActiveFormats = useCallback(() => {
      try {
        if (!document.queryCommandEnabled) return;
        
        // Use requestAnimationFrame for smoother UI updates
        requestAnimationFrame(() => {
          setActiveFormats({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            h1: document.queryCommandValue('formatBlock').toLowerCase() === 'h1' || document.queryCommandValue('formatBlock').toLowerCase() === '<h1>',
            h2: document.queryCommandValue('formatBlock').toLowerCase() === 'h2' || document.queryCommandValue('formatBlock').toLowerCase() === '<h2>',
            ul: document.queryCommandState('insertUnorderedList'),
            ol: document.queryCommandState('insertOrderedList'),
            blockquote: document.queryCommandValue('formatBlock').toLowerCase() === 'blockquote' || document.queryCommandValue('formatBlock').toLowerCase() === '<blockquote>',
            alignLeft: document.queryCommandState('justifyLeft'),
            alignCenter: document.queryCommandState('justifyCenter'),
            alignRight: document.queryCommandState('justifyRight'),
            alignJustify: document.queryCommandState('justifyFull')
          });
        });
      } catch (error) {
        console.error('Error checking active formats:', error);
      }
    }, []);

    // Simple function to preserve caret position
    const preserveCaretPosition = useCallback(() => {
      // Only track position when editor has focus
      if (document.activeElement !== editorRef.current) return;
      
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      // Store the current offset
      lastCaretPosition.current = selection.focusOffset;
    }, []);

    const handleChange = useCallback(() => {
      // Track caret position before changes
      preserveCaretPosition();
      
      updateCharCount();
      isInternalChange.current = true;
      if (onChange && editorRef.current) {
        // Debounce onChange for better performance
        const content = editorRef.current.innerHTML;
        onChange(content);
      }
      checkActiveFormats();
    }, [onChange, updateCharCount, checkActiveFormats, preserveCaretPosition]);

    // Initialize editor content
    useEffect(() => {
      if (editorRef.current) {
        // Only update if the value has actually changed
        if (editorRef.current.innerHTML !== (value || initialValue)) {
          editorRef.current.innerHTML = value || initialValue;
          updateCharCount();
        }
      }
    }, [initialValue, updateCharCount, value]);
    
    // Add event listeners for selection changes
    useEffect(() => {
      const handleSelectionChange = () => {
        if (document.activeElement === editorRef.current) {
          checkActiveFormats();
        }
      };
      
      // Improve responsiveness with multiple event listeners
      document.addEventListener('selectionchange', handleSelectionChange);
      
      // Add pointer event listeners to the editor
      const editor = editorRef.current;
      if (editor) {
        editor.addEventListener('pointerdown', checkActiveFormats);
        editor.addEventListener('pointerup', checkActiveFormats);
      }
      
      return () => {
        document.removeEventListener('selectionchange', handleSelectionChange);
        if (editor) {
          editor.removeEventListener('pointerdown', checkActiveFormats);
          editor.removeEventListener('pointerup', checkActiveFormats);
        }
      };
    }, [checkActiveFormats]);

    // Update content when value prop changes (external change)
    useEffect(() => {
      if (value !== undefined && editorRef.current && !isInternalChange.current) {
        // Only update if the value has actually changed
        if (editorRef.current.innerHTML !== value) {
          editorRef.current.innerHTML = value;
          updateCharCount();
        }
      }
      isInternalChange.current = false;
    }, [value, updateCharCount]);
    
    // Update showPreview state when prop changes
    useEffect(() => {
      setShowPreview(initialShowPreview);
    }, [initialShowPreview]);

    // Expose methods via ref
    useEffect(() => {
      if (ref) {
        if (typeof ref === 'function') {
          ref({
            getContent: getContent,
            getHTML: getContent,
            focus: () => editorRef.current?.focus(),
            clearContent: () => {
              if (editorRef.current) {
                editorRef.current.innerHTML = '';
                handleChange();
              }
            }
          });
        } else {
          ref.current = {
            getContent: getContent,
            getHTML: getContent,
            focus: () => editorRef.current?.focus(),
            clearContent: () => {
              if (editorRef.current) {
                editorRef.current.innerHTML = '';
                handleChange();
              }
            }
          };
        }
      }
    }, [ref, handleChange]);
    
    const execCommand = useCallback((command: string, value: string = '') => {
      try {
        // Save current selection
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        
        document.execCommand(command, false, value);
        
        // Restore focus and selection
        editorRef.current?.focus();
        if (range && selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
        
        // Update state after command execution
        checkActiveFormats();
        
        // Don't call handleChange here to prevent cursor jumping
        if (onChange && editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      } catch (error) {
        console.error(`Error executing command ${command}:`, error);
      }
    }, [onChange, checkActiveFormats]);

    const formatBold = useCallback(() => execCommand('bold'), [execCommand]);
    const formatItalic = useCallback(() => execCommand('italic'), [execCommand]);
    const formatUnderline = useCallback(() => execCommand('underline'), [execCommand]);
    const formatHeading = useCallback((level: number) => {
      execCommand('formatBlock', `<h${level}>`);
    }, [execCommand]);
    const formatBulletList = useCallback(() => execCommand('insertUnorderedList'), [execCommand]);
    const formatNumberedList = useCallback(() => execCommand('insertOrderedList'), [execCommand]);
    const formatQuote = useCallback(() => execCommand('formatBlock', '<blockquote>'), [execCommand]);
    const formatLink = useCallback(() => {
      const url = prompt('Enter URL:', 'https://');
      if (url) execCommand('createLink', url);
    }, [execCommand]);
    const formatImage = useCallback(() => {
      const url = prompt('Enter image URL:', 'https://');
      if (url) execCommand('insertImage', url);
    }, [execCommand]);
    const formatAlign = useCallback((align: string) => execCommand('justify' + align), [execCommand]);
    const handleUndo = useCallback(() => execCommand('undo'), [execCommand]);
    const handleRedo = useCallback(() => execCommand('redo'), [execCommand]);

    // Use memo for better performance
    const MenuButton = memo(({ 
      onClick, 
      active = false,
      children 
    }: { 
      onClick: () => void; 
      active?: boolean;
      children: React.ReactNode;
    }) => (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
        onMouseDown={(e) => {
          // Prevent losing selection when clicking buttons
          e.preventDefault();
        }}
        className={`p-2 rounded-md transition-colors ${
          active ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        {children}
      </button>
    ));

    return (
      <div className={`flex flex-col space-y-2 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        
        <div className="border border-gray-300 rounded-md overflow-hidden">
          {/* Editor Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
            <MenuButton onClick={formatBold} active={activeFormats.bold}>
              <Bold size={18} />
            </MenuButton>
            
            <MenuButton onClick={formatItalic} active={activeFormats.italic}>
              <Italic size={18} />
            </MenuButton>
            
            <MenuButton onClick={formatUnderline} active={activeFormats.underline}>
              <Underline size={18} />
            </MenuButton>
            
            <div className="w-px h-6 bg-gray-300 mx-1" />
            
            <MenuButton onClick={() => formatHeading(1)} active={activeFormats.h1}>
              <Heading1 size={18} />
            </MenuButton>
            
            <MenuButton onClick={() => formatHeading(2)} active={activeFormats.h2}>
              <Heading2 size={18} />
            </MenuButton>
            
            <div className="w-px h-6 bg-gray-300 mx-1" />
            
            <MenuButton onClick={formatBulletList} active={activeFormats.ul}>
              <List size={18} />
            </MenuButton>
            
            <MenuButton onClick={formatNumberedList} active={activeFormats.ol}>
              <ListOrdered size={18} />
            </MenuButton>
            
            <MenuButton onClick={formatQuote} active={activeFormats.blockquote}>
              <Quote size={18} />
            </MenuButton>
            
            <div className="w-px h-6 bg-gray-300 mx-1" />
            
            <MenuButton onClick={formatLink}>
              <Link size={18} />
            </MenuButton>
            
            <MenuButton onClick={formatImage}>
              <Image size={18} />
            </MenuButton>
            
            <div className="w-px h-6 bg-gray-300 mx-1" />
            
            <MenuButton onClick={() => formatAlign('Left')} active={activeFormats.alignLeft}>
              <AlignLeft size={18} />
            </MenuButton>
            
            <MenuButton onClick={() => formatAlign('Center')} active={activeFormats.alignCenter}>
              <AlignCenter size={18} />
            </MenuButton>
            
            <MenuButton onClick={() => formatAlign('Right')} active={activeFormats.alignRight}>
              <AlignRight size={18} />
            </MenuButton>
            
            <MenuButton onClick={() => formatAlign('Full')} active={activeFormats.alignJustify}>
              <AlignJustify size={18} />
            </MenuButton>
            
            <div className="w-px h-6 bg-gray-300 mx-1" />
            
            <MenuButton onClick={handleUndo}>
              <Undo size={18} />
            </MenuButton>
            
            <MenuButton onClick={handleRedo}>
              <Redo size={18} />
            </MenuButton>
            
            <div className="flex-grow" />
            
            <MenuButton 
              onClick={() => setShowPreview(!showPreview)}
              active={showPreview}
            >
              {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
            </MenuButton>
          </div>
          
          {/* Editor Content */}
          <div className={`transition-all duration-200 ${showPreview ? 'bg-gray-50' : 'bg-white'}`}>
            <div
              ref={editorRef}
              contentEditable={!showPreview}
              onInput={() => {
                // Direct event handling to prevent cursor jumping
                if (onChange && editorRef.current) {
                  onChange(editorRef.current.innerHTML);
                }
                updateCharCount();
                checkActiveFormats();
              }}
              onBlur={handleChange}
              onMouseUp={checkActiveFormats}
              onMouseDown={checkActiveFormats}
              onClick={checkActiveFormats}
              onKeyUp={checkActiveFormats}
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault(); // Prevent losing focus
                }
                preserveCaretPosition();
                checkActiveFormats();
              }}
              className="rich-text-editor-content p-4 w-full"
              onFocus={checkActiveFormats}
              data-placeholder={placeholder}
              suppressContentEditableWarning={true}
            />
          </div>
          
          {/* Character Count */}
          {maxLength && (
            <div className="flex justify-end p-2 text-sm text-gray-500 border-t border-gray-200">
              {charCount} / {maxLength} characters
              {charCount > maxLength && (
                <span className="ml-2 text-red-500">
                  ({charCount - maxLength} over limit)
                </span>
              )}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';
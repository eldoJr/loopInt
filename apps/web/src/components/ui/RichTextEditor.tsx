import { forwardRef, useEffect, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import ListItem from '@tiptap/extension-list-item';
import Underline from '@tiptap/extension-underline';
import FontFamily from '@tiptap/extension-font-family';
import { Extension } from '@tiptap/core';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Code,
  Eraser,
  Palette,
  ChevronDown,
  Minus,
  Type,
  Heading1,
  Heading2,
  Heading3,
  FileText,
} from 'lucide-react';

interface RichTextEditorProps {
  label?: string;
  error?: string;
  required?: boolean;
  onChange?: (value: string) => void;
  value?: string;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  minHeight?: string;
}

export interface RichTextEditorRef {
  getContent: () => string;
  getHTML: () => string;
  focus: () => void;
  clearContent: () => void;
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ label, error, required, className = '', onChange, value, placeholder = 'Write something...', minHeight = '200px' }, ref) => {
    const [, setCharCount] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showStyleDropdown, setShowStyleDropdown] = useState(false);
    const [showFontDropdown, setShowFontDropdown] = useState(false);
    const [showSizeDropdown, setShowSizeDropdown] = useState(false);
    const [showAlignDropdown, setShowAlignDropdown] = useState(false);
    const [fontSearch, setFontSearch] = useState('');
    const [sizeSearch, setSizeSearch] = useState('');
    const [, setUpdateCounter] = useState(0);

    // Close all dropdowns helper
    const closeAllDropdowns = useCallback(() => {
      setShowColorPicker(false);
      setShowStyleDropdown(false);
      setShowFontDropdown(false);
      setShowSizeDropdown(false);
      setShowAlignDropdown(false);
      setFontSearch('');
      setSizeSearch('');
    }, []);

    // Handle dropdown toggle with auto-close others
    const toggleDropdown = useCallback((dropdownName: string) => {
      const isCurrentlyOpen = {
        color: showColorPicker,
        style: showStyleDropdown,
        font: showFontDropdown,
        size: showSizeDropdown,
        align: showAlignDropdown
      }[dropdownName];
      
      closeAllDropdowns();
      
      if (!isCurrentlyOpen) {
        switch (dropdownName) {
          case 'color':
            setShowColorPicker(true);
            break;
          case 'style':
            setShowStyleDropdown(true);
            break;
          case 'font':
            setShowFontDropdown(true);
            break;
          case 'size':
            setShowSizeDropdown(true);
            break;
          case 'align':
            setShowAlignDropdown(true);
            break;
        }
      }
    }, [closeAllDropdowns, showColorPicker, showStyleDropdown, showFontDropdown, showSizeDropdown, showAlignDropdown]);

    // Close dropdowns when clicking outside
    useEffect(() => {
      const handleClickOutside = () => closeAllDropdowns();
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }, [closeAllDropdowns]);
    
    const colors = [
      '#000000', '#374151', '#6B7280', '#9CA3AF',
      '#EF4444', '#F97316', '#EAB308', '#22C55E',
      '#3B82F6', '#8B5CF6', '#EC4899', '#F43F5E',
    ];

    const fontFamilies = [
      { name: 'Default', value: '' },
      { name: 'Arial', value: 'Arial, sans-serif' },
      { name: 'Helvetica', value: 'Helvetica, sans-serif' },
      { name: 'Times New Roman', value: 'Times New Roman, serif' },
      { name: 'Georgia', value: 'Georgia, serif' },
      { name: 'Courier New', value: 'Courier New, monospace' },
    ];

    const fontSizes = ['8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '30px', '32px', '36px', '40px', '44px', '48px'];

    // Filter functions
    const filteredFonts = fontFamilies.filter(font => 
      font.name.toLowerCase().includes(fontSearch.toLowerCase())
    );
    
    const filteredSizes = fontSizes.filter(size => 
      size.includes(sizeSearch)
    );

    // Handle custom font input
    const handleCustomFont = (value: string) => {
      if (value.trim()) {
        const fontValue = value.includes(',') ? value.trim() : `${value.trim()}, sans-serif`;
        editor?.chain().setFontFamily(fontValue).run();
        closeAllDropdowns();
      }
    };

    // Handle custom size input
    const handleCustomSize = (value: string) => {
      let sizeValue = value.trim();
      // Add px if just a number
      if (/^\d+$/.test(sizeValue)) {
        sizeValue += 'px';
      }
      if (sizeValue && /^\d+px$/.test(sizeValue)) {
        editor?.chain().setFontSize(sizeValue).run();
        closeAllDropdowns();
      }
    };

    const getCurrentStyle = () => {
      if (editor?.isActive('heading', { level: 1 })) return 'Heading 1';
      if (editor?.isActive('heading', { level: 2 })) return 'Heading 2';
      if (editor?.isActive('heading', { level: 3 })) return 'Heading 3';
      return 'Paragraph';
    };

    const getCurrentFont = () => {
      if (!editor) return 'Default';
      
      const attrs = editor.getAttributes('textStyle');
      if (attrs?.fontFamily) {
        const found = fontFamilies.find(f => f.value === attrs.fontFamily);
        return found ? found.name : attrs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
      }
      
      return 'Default';
    };

    const getCurrentSize = () => {
      if (!editor) return '16px';
      
      const attrs = editor.getAttributes('textStyle');
      if (attrs?.fontSize) {
        return attrs.fontSize;
      }
      
      // Check if we're in a heading and return appropriate size
      if (editor.isActive('heading', { level: 1 })) return '32px';
      if (editor.isActive('heading', { level: 2 })) return '24px';
      if (editor.isActive('heading', { level: 3 })) return '20px';
      
      return '16px';
    };

    const getCurrentColor = () => {
      if (!editor) return null;
      const attrs = editor.getAttributes('textStyle');
      return attrs?.color || null;
    };

    const alignments = [
      { name: 'Left', action: () => editor?.chain().focus().setTextAlign('left').run(), active: () => editor?.isActive({ textAlign: 'left' }) || (!editor?.isActive({ textAlign: 'center' }) && !editor?.isActive({ textAlign: 'right' }) && !editor?.isActive({ textAlign: 'justify' })), icon: AlignLeft },
      { name: 'Center', action: () => editor?.chain().focus().setTextAlign('center').run(), active: () => editor?.isActive({ textAlign: 'center' }), icon: AlignCenter },
      { name: 'Right', action: () => editor?.chain().focus().setTextAlign('right').run(), active: () => editor?.isActive({ textAlign: 'right' }), icon: AlignRight },
      { name: 'Justify', action: () => editor?.chain().focus().setTextAlign('justify').run(), active: () => editor?.isActive({ textAlign: 'justify' }), icon: AlignJustify },
    ];

    const styles = [
      { name: 'Paragraph', action: () => editor?.chain().focus().setParagraph().run(), active: () => !editor?.isActive('heading'), icon: FileText },
      { name: 'Heading 1', action: () => editor?.chain().focus().setHeading({ level: 1 }).run(), active: () => editor?.isActive('heading', { level: 1 }), icon: Heading1 },
      { name: 'Heading 2', action: () => editor?.chain().focus().setHeading({ level: 2 }).run(), active: () => editor?.isActive('heading', { level: 2 }), icon: Heading2 },
      { name: 'Heading 3', action: () => editor?.chain().focus().setHeading({ level: 3 }).run(), active: () => editor?.isActive('heading', { level: 3 }), icon: Heading3 },
    ];

    const FontSize = Extension.create({
      name: 'fontSize',
      addGlobalAttributes() {
        return [
          {
            types: ['textStyle'],
            attributes: {
              fontSize: {
                default: null,
                parseHTML: element => element.style.fontSize.replace(/['\"]/, ''),
                renderHTML: attributes => {
                  if (!attributes.fontSize) return {};
                  return { style: `font-size: ${attributes.fontSize}` };
                },
              },
            },
          },
        ];
      },
      addCommands() {
        return {
          setFontSize: (fontSize: string) => ({ chain }) => {
            return chain().setMark('textStyle', { fontSize }).run();
          },
          unsetFontSize: () => ({ chain }) => {
            return chain().setMark('textStyle', { fontSize: null }).run();
          },
        };
      },
    });

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
            HTMLAttributes: {
              class: 'heading',
            },
          },
          bulletList: {
            keepMarks: true,
            keepAttributes: false,
            HTMLAttributes: {
              class: 'bullet-list',
            },
          },
          orderedList: {
            keepMarks: true,
            keepAttributes: false,
            HTMLAttributes: {
              class: 'ordered-list',
            },
          },
          listItem: {
            HTMLAttributes: {
              class: 'list-item',
            },
          },
        }),
        TextStyle,
        Color,
        Underline,
        ListItem,
        FontFamily,
        FontSize,
        TextAlign.configure({ 
          types: ['heading', 'paragraph'],
          alignments: ['left', 'center', 'right', 'justify'],
        }),
        Link.configure({ 
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300',
          },
        }),
        Image.configure({
          HTMLAttributes: {
            class: 'max-w-full h-auto rounded-lg',
          },
        }),
        Placeholder.configure({ placeholder }),
      ],
      content: value || '',
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        onChange?.(html);
        setCharCount(editor.getText().length);
        // Force re-render to update toolbar states
        setUpdateCounter(prev => prev + 1);
      },
      onSelectionUpdate: () => {
        // Force re-render to update all toolbar button states
        setUpdateCounter(prev => prev + 1);
      },
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
    });

    useEffect(() => {
      if (editor && value !== undefined && editor.getHTML() !== value) {
        editor.commands.setContent(value);
      }
    }, [editor, value]);

    useEffect(() => {
      if (editor) {
        setCharCount(editor.getText().length);
      }
    }, [editor]);

    useEffect(() => {
      if (ref) {
        const methods = {
          getContent: () => editor?.getHTML() || '',
          getHTML: () => editor?.getHTML() || '',
          focus: () => editor?.commands.focus(),
          clearContent: () => editor?.commands.clearContent(),
        };
        if (typeof ref === 'function') {
          ref(methods);
        } else {
          ref.current = methods;
        }
      }
    }, [ref, editor]);

    const MenuButton = useCallback(({ onClick, active = false, disabled = false, children, tooltip, size = 'default' }: { onClick: () => void; active?: boolean; disabled?: boolean; children: React.ReactNode; tooltip?: string; size?: 'sm' | 'default' }) => (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={tooltip}
        className={`${size === 'sm' ? 'p-1.5' : 'p-2'} rounded-lg group relative ${
          active 
            ? 'bg-blue-500 text-white shadow-lg' 
            : disabled
            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
            : 'text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300'
        }`}
      >
        {children}
        {tooltip && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
            {tooltip}
          </div>
        )}
      </button>
    ), []);

    const addLink = useCallback(() => {
      const url = prompt('Enter URL:', 'https://');
      if (url) editor?.chain().focus().setLink({ href: url }).run();
    }, [editor]);

    const addImage = useCallback(() => {
      const url = prompt('Enter image URL:', 'https://');
      if (url) editor?.chain().focus().setImage({ src: url }).run();
    }, [editor]);

    if (!editor) return null;

    return (
      <div className={`flex flex-col space-y-2 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className={`border rounded-2xl overflow-hidden bg-white dark:bg-gray-900 transition-all duration-300 backdrop-blur-sm ${
          isFocused 
            ? 'border-blue-500 dark:border-blue-400 shadow-2xl shadow-blue-500/10 ring-4 ring-blue-100/50 dark:ring-blue-900/30 scale-[1.01]' 
            : error
            ? 'border-red-500 dark:border-red-400 shadow-lg shadow-red-500/10'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-lg hover:shadow-xl'
        }`}>
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50/90 to-gray-100/50 dark:from-gray-800/90 dark:to-gray-700/50 backdrop-blur-sm">
            {/* First Row - Essential formatting */}
            <div className="flex items-center justify-between p-2 sm:p-3">
              <div className="flex items-center gap-1">
                <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} tooltip="Bold" size="sm">
                  <Bold size={14} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} tooltip="Italic" size="sm">
                  <Italic size={14} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} tooltip="Underline" size="sm">
                  <UnderlineIcon size={14} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} tooltip="Strike" size="sm">
                  <Strikethrough size={14} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} tooltip="Code" size="sm">
                  <Code size={14} />
                </MenuButton>
              </div>
              
              <div className="flex items-center gap-1">
                <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} tooltip="Undo" size="sm">
                  <Undo size={14} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} tooltip="Redo" size="sm">
                  <Redo size={14} />
                </MenuButton>
              </div>
            </div>
            
            {/* Second Row - Style and tools */}
            <div className="flex items-center justify-between px-2 pb-2 sm:px-3 sm:pb-3 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-1">
                {/* Style Dropdown */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <MenuButton 
                    onClick={() => toggleDropdown('style')} 
                    active={showStyleDropdown}
                    tooltip="Style"
                    size="sm"
                  >
                    <div className="flex items-center gap-1">
                      <Type size={12} />
                      <span className="text-xs hidden sm:inline">{getCurrentStyle()}</span>
                      <ChevronDown size={8} className={showStyleDropdown ? 'rotate-180' : ''} />
                    </div>
                  </MenuButton>
                  
                  {showStyleDropdown && (
                    <div className="absolute top-full left-0 mt-2 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-[100] min-w-40 backdrop-blur-sm">
                      {styles.map((style) => {
                        const isActive = style.active();
                        const IconComponent = style.icon;
                        return (
                          <button
                            key={style.name}
                            onClick={() => {
                              style.action();
                              closeAllDropdowns();
                            }}
                            className={`w-full text-left px-3 py-2.5 text-sm rounded-lg flex items-center gap-3 ${
                              isActive 
                                ? 'bg-blue-500 text-white font-medium' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300'
                            }`}
                          >
                            <IconComponent size={16} />
                            <span className={isActive ? 'font-medium' : ''}>{style.name}</span>
                            {isActive && <span className="ml-auto text-blue-200">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                {/* Color Picker */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <MenuButton 
                    onClick={() => toggleDropdown('color')} 
                    active={showColorPicker}
                    tooltip="Color"
                    size="sm"
                  >
                    <div className="flex items-center gap-1">
                      <div className="relative">
                        <Palette size={14} />
                        {getCurrentColor() && (
                          <div 
                            className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-white dark:border-gray-800"
                            style={{ backgroundColor: getCurrentColor() }}
                          />
                        )}
                      </div>
                    </div>
                  </MenuButton>
                  
                  {showColorPicker && (
                    <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-[100] backdrop-blur-sm">
                      <div className="grid grid-cols-4 gap-2">
                        {colors.map((color) => {
                          const isActive = editor?.getAttributes('textStyle')?.color === color;
                          return (
                            <button
                              key={color}
                              onClick={() => {
                                editor.chain().focus().setColor(color).run();
                                closeAllDropdowns();
                              }}
                              className={`w-7 h-7 rounded-lg border-2 relative group ${
                                isActive 
                                  ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                              }`}
                              style={{ backgroundColor: color }}
                              title={color}
                            >
                              {isActive && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => {
                          editor.chain().focus().unsetColor().run();
                          closeAllDropdowns();
                        }}
                        className="w-full mt-3 px-3 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium"
                      >
                        Remove Color
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Lists */}
                <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} tooltip="List" size="sm">
                  <List size={14} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} tooltip="Numbers" size="sm">
                  <ListOrdered size={14} />
                </MenuButton>
              </div>
              
              <div className="flex items-center gap-1">
                {/* Alignment */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <MenuButton 
                    onClick={() => toggleDropdown('align')} 
                    active={showAlignDropdown}
                    tooltip="Align"
                    size="sm"
                  >
                    <div className="flex items-center gap-1">
                      {(() => {
                        const activeAlignment = alignments.find(a => a.active());
                        const IconComponent = activeAlignment?.icon || AlignLeft;
                        return <IconComponent size={14} />;
                      })()}
                    </div>
                  </MenuButton>
                  
                  {showAlignDropdown && (
                    <div className="absolute top-full left-0 mt-1 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[100] min-w-32">
                      {alignments.map((align) => {
                        const isActive = align.active();
                        const IconComponent = align.icon;
                        return (
                          <button
                            key={align.name}
                            onClick={() => {
                              align.action();
                              closeAllDropdowns();
                            }}
                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-150 flex items-center gap-2 ${
                              isActive 
                                ? 'bg-blue-500 text-white shadow-sm font-medium' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300'
                            }`}
                          >
                            <IconComponent size={16} />
                            <span>{align.name}</span>
                            {isActive && <span className="ml-auto text-blue-200">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} tooltip="Quote" size="sm">
                  <Quote size={14} />
                </MenuButton>
                <MenuButton onClick={addLink} active={editor.isActive('link')} tooltip="Link" size="sm">
                  <LinkIcon size={14} />
                </MenuButton>
                <MenuButton onClick={addImage} tooltip="Image" size="sm">
                  <ImageIcon size={14} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} tooltip="Line" size="sm">
                  <Minus size={14} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} tooltip="Clear" size="sm">
                  <Eraser size={14} />
                </MenuButton>
              </div>
            </div>
          </div>

          <EditorContent 
            editor={editor} 
            className="prose prose-sm dark:prose-invert max-w-none p-3 sm:p-6 focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:leading-relaxed [&_h1]:text-2xl sm:[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 sm:[&_h1]:mb-6 [&_h1]:text-gray-900 dark:[&_h1]:text-gray-100 [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mb-3 sm:[&_h2]:mb-4 [&_h2]:text-gray-800 dark:[&_h2]:text-gray-200 [&_h3]:text-lg sm:[&_h3]:text-xl [&_h3]:font-medium [&_h3]:mb-2 sm:[&_h3]:mb-3 [&_h3]:text-gray-700 dark:[&_h3]:text-gray-300 [&_p]:mb-3 sm:[&_p]:mb-4 [&_p]:text-gray-700 dark:[&_p]:text-gray-300 [&_ul]:list-disc [&_ul]:ml-4 sm:[&_ul]:ml-6 [&_ul]:mb-3 sm:[&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-4 sm:[&_ol]:ml-6 [&_ol]:mb-3 sm:[&_ol]:mb-4 [&_li]:mb-1 sm:[&_li]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-400 [&_blockquote]:pl-4 sm:[&_blockquote]:pl-6 [&_blockquote]:py-2 [&_blockquote]:italic [&_blockquote]:text-gray-600 dark:[&_blockquote]:text-gray-400 [&_blockquote]:bg-blue-50/50 dark:[&_blockquote]:bg-blue-900/10 [&_blockquote]:rounded-r-lg [&_hr]:border-gray-300 dark:[&_hr]:border-gray-600 [&_hr]:my-4 sm:[&_hr]:my-6 [&_code]:bg-gray-100 dark:[&_code]:bg-gray-800 [&_code]:px-1.5 sm:[&_code]:px-2 [&_code]:py-0.5 sm:[&_code]:py-1 [&_code]:rounded-md [&_code]:text-sm [&_code]:font-mono"
            style={{ minHeight }}
            onClick={closeAllDropdowns}
          />
          
          {/* Word Count */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 sm:px-4 py-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {editor.getText().length} characters
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-2">
            <span className="text-red-500 font-medium text-sm">{error}</span>
          </div>
        )}
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';
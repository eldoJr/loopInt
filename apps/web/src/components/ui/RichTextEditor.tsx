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
      closeAllDropdowns();
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
    }, [closeAllDropdowns]);

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

    const getFormattingInfo = () => {
      if (!editor) return [];
      
      const info = [];
      
      // Text style
      info.push({ label: 'Style', value: getCurrentStyle() });
      
      // Font family
      const font = getCurrentFont();
      if (font !== 'Default') {
        info.push({ label: 'Font', value: font });
      }
      
      // Font size
      info.push({ label: 'Size', value: getCurrentSize() });
      
      // Text formatting
      const formatting = [];
      if (editor.isActive('bold')) formatting.push('Bold');
      if (editor.isActive('italic')) formatting.push('Italic');
      if (editor.isActive('underline')) formatting.push('Underline');
      if (editor.isActive('strike')) formatting.push('Strikethrough');
      if (editor.isActive('code')) formatting.push('Code');
      
      if (formatting.length > 0) {
        info.push({ label: 'Format', value: formatting.join(', ') });
      }
      
      // Text color
      const color = getCurrentColor();
      if (color) {
        info.push({ label: 'Color', value: color });
      }
      
      // Alignment
      const alignment = getCurrentAlignment();
      if (alignment !== 'Left') {
        info.push({ label: 'Align', value: alignment });
      }
      
      // Lists
      if (editor.isActive('bulletList')) {
        info.push({ label: 'List', value: 'Bullet List' });
      } else if (editor.isActive('orderedList')) {
        info.push({ label: 'List', value: 'Numbered List' });
      }
      
      // Other elements
      if (editor.isActive('blockquote')) {
        info.push({ label: 'Element', value: 'Blockquote' });
      }
      if (editor.isActive('link')) {
        info.push({ label: 'Link', value: 'Active' });
      }
      
      return info;
    };

    const getCurrentAlignment = () => {
      if (editor?.isActive({ textAlign: 'center' })) return 'Center';
      if (editor?.isActive({ textAlign: 'right' })) return 'Right';
      if (editor?.isActive({ textAlign: 'justify' })) return 'Justify';
      return 'Left';
    };

    const alignments = [
      { name: 'Left', action: () => editor?.chain().focus().setTextAlign('left').run(), active: () => editor?.isActive({ textAlign: 'left' }) || (!editor?.isActive({ textAlign: 'center' }) && !editor?.isActive({ textAlign: 'right' }) && !editor?.isActive({ textAlign: 'justify' })), icon: AlignLeft },
      { name: 'Center', action: () => editor?.chain().focus().setTextAlign('center').run(), active: () => editor?.isActive({ textAlign: 'center' }), icon: AlignCenter },
      { name: 'Right', action: () => editor?.chain().focus().setTextAlign('right').run(), active: () => editor?.isActive({ textAlign: 'right' }), icon: AlignRight },
      { name: 'Justify', action: () => editor?.chain().focus().setTextAlign('justify').run(), active: () => editor?.isActive({ textAlign: 'justify' }), icon: AlignJustify },
    ];

    const styles = [
      { name: 'Paragraph', action: () => editor?.chain().focus().setParagraph().run(), active: () => !editor?.isActive('heading') },
      { name: 'Heading 1', action: () => editor?.chain().focus().setHeading({ level: 1 }).run(), active: () => editor?.isActive('heading', { level: 1 }) },
      { name: 'Heading 2', action: () => editor?.chain().focus().setHeading({ level: 2 }).run(), active: () => editor?.isActive('heading', { level: 2 }) },
      { name: 'Heading 3', action: () => editor?.chain().focus().setHeading({ level: 3 }).run(), active: () => editor?.isActive('heading', { level: 3 }) },
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

    const MenuButton = useCallback(({ onClick, active = false, disabled = false, children, tooltip }: { onClick: () => void; active?: boolean; disabled?: boolean; children: React.ReactNode; tooltip?: string }) => (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={tooltip}
        className={`p-2 rounded-md transition-all duration-150 ${
          active 
            ? 'bg-blue-500 text-white shadow-md ring-2 ring-blue-200 dark:ring-blue-800' 
            : disabled
            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
            : 'text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 hover:shadow-sm'
        }`}
      >
        {children}
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

        <div className={`border rounded-xl overflow-hidden bg-white dark:bg-gray-900 transition-all duration-200 shadow-sm ${
          isFocused 
            ? 'border-blue-500 dark:border-blue-400 shadow-lg ring-2 ring-blue-100 dark:ring-blue-900/30' 
            : error
            ? 'border-red-500 dark:border-red-400'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }`}>
          <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80">
            {/* Text Formatting */}
            <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} tooltip="Bold (Ctrl+B)">
              <Bold size={16} />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} tooltip="Italic (Ctrl+I)">
              <Italic size={16} />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} tooltip="Underline (Ctrl+U)">
              <UnderlineIcon size={16} />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} tooltip="Strikethrough">
              <Strikethrough size={16} />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} tooltip="Inline Code">
              <Code size={16} />
            </MenuButton>
            
            
            {/* Color Picker */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <MenuButton 
                onClick={() => toggleDropdown('color')} 
                active={showColorPicker}
                tooltip="Text Color"
              >
                <div className="flex items-center gap-1">
                  <Palette size={16} />
                  <ChevronDown size={12} />
                </div>
              </MenuButton>
              
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[100]">
                  <div className="grid grid-cols-4 gap-1">
                    {colors.map((color) => {
                      const isActive = editor?.getAttributes('textStyle')?.color === color;
                      return (
                        <button
                          key={color}
                          onClick={() => {
                            editor.chain().focus().setColor(color).run();
                            closeAllDropdowns();
                          }}
                          className={`w-6 h-6 rounded border-2 hover:scale-110 transition-all ${
                            isActive 
                              ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      );
                    })}
                  </div>
                  <button
                    onClick={() => {
                      editor.chain().focus().unsetColor().run();
                      closeAllDropdowns();
                    }}
                    className="w-full mt-2 px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    Remove Color
                  </button>
                </div>
              )}
            </div>
            
            <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-2" />
            
            {/* Style Dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <MenuButton 
                onClick={() => toggleDropdown('style')} 
                active={showStyleDropdown}
                tooltip="Text Style"
              >
                <div className="flex items-center gap-1 min-w-20 text-xs">
                  <span>{getCurrentStyle()}</span>
                  <ChevronDown size={12} />
                </div>
              </MenuButton>
              
              {showStyleDropdown && (
                <div className="absolute top-full left-0 mt-1 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[100] min-w-36">
                  {styles.map((style) => {
                    const isActive = style.active();
                    return (
                      <button
                        key={style.name}
                        onClick={() => {
                          style.action();
                          closeAllDropdowns();
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-150 ${
                          isActive 
                            ? 'bg-blue-500 text-white shadow-sm font-medium' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300'
                        }`}
                      >
                        <span className={isActive ? 'font-medium' : ''}>{style.name}</span>
                        {isActive && <span className="ml-2 text-blue-200">✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Font Family Combobox */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              {showFontDropdown ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={fontSearch !== '' ? fontSearch : getCurrentFont()}
                    onChange={(e) => setFontSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const inputValue = fontSearch !== '' ? fontSearch : getCurrentFont();
                        handleCustomFont(inputValue);
                      } else if (e.key === 'Escape') {
                        closeAllDropdowns();
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        if (fontSearch !== '') {
                          handleCustomFont(fontSearch);
                        }
                        closeAllDropdowns();
                      }, 200);
                    }}
                    onFocus={(e) => {
                      if (fontSearch === '') {
                        e.target.select();
                      }
                    }}
                    className="px-2 py-1 text-xs min-w-16 max-w-24 border border-blue-500 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Font family..."
                    autoFocus
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    toggleDropdown('font');
                  }}
                  className="p-2 rounded-md transition-all duration-150 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 hover:shadow-sm"
                  title="Font Family"
                >
                  <div className="flex items-center gap-1 text-xs min-w-16">
                    <span className="truncate">{getCurrentFont()}</span>
                    <ChevronDown size={12} />
                  </div>
                </button>
              )}
              
              {showFontDropdown && (
                <div className="absolute top-full left-0 mt-1 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[100] min-w-44 max-h-48 overflow-y-auto">
                  {filteredFonts.length > 0 ? (
                    filteredFonts.map((font) => {
                      const isActive = getCurrentFont() === font.name;
                      return (
                        <button
                          key={font.name}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            if (font.value) {
                              editor?.chain().setFontFamily(font.value).run();
                            } else {
                              editor?.chain().unsetFontFamily().run();
                            }
                            closeAllDropdowns();
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-150 flex items-center justify-between ${
                            isActive 
                              ? 'bg-blue-500 text-white shadow-sm font-medium' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300'
                          }`}
                          style={{ fontFamily: font.value }}
                        >
                          <span>{font.name}</span>
                          {isActive && <span className="text-blue-200">✓</span>}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                      {fontSearch ? (
                        <button
                          onClick={() => handleCustomFont(fontSearch)}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Use "{fontSearch}" as custom font
                        </button>
                      ) : (
                        'No fonts found'
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Font Size Combobox */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              {showSizeDropdown ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={sizeSearch !== '' ? sizeSearch : getCurrentSize()}
                    onChange={(e) => setSizeSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const inputValue = sizeSearch !== '' ? sizeSearch : getCurrentSize();
                        handleCustomSize(inputValue);
                      } else if (e.key === 'Escape') {
                        closeAllDropdowns();
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        if (sizeSearch !== '') {
                          handleCustomSize(sizeSearch);
                        }
                        closeAllDropdowns();
                      }, 200);
                    }}
                    onFocus={(e) => {
                      if (sizeSearch === '') {
                        e.target.select();
                      }
                    }}
                    className="px-2 py-1 text-xs min-w-12 max-w-16 border border-blue-500 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Size..."
                    autoFocus
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    toggleDropdown('size');
                  }}
                  className="p-2 rounded-md transition-all duration-150 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 hover:shadow-sm"
                  title="Font Size"
                >
                  <div className="flex items-center gap-1 text-xs min-w-12">
                    <span>{getCurrentSize()}</span>
                    <ChevronDown size={12} />
                  </div>
                </button>
              )}
              
              {showSizeDropdown && (
                <div className="absolute top-full left-0 mt-1 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[100] min-w-32 max-h-48 overflow-y-auto">
                  {filteredSizes.length > 0 ? (
                    filteredSizes.map((size) => {
                      const isActive = getCurrentSize() === size;
                      return (
                        <button
                          key={size}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            editor?.chain().setFontSize(size).run();
                            closeAllDropdowns();
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-150 flex items-center justify-between ${
                            isActive 
                              ? 'bg-blue-500 text-white shadow-sm font-medium' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300'
                          }`}
                        >
                          <span>{size}</span>
                          {isActive && <span className="text-blue-200">✓</span>}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                      {sizeSearch && /^\d+px$/.test(sizeSearch.trim()) ? (
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleCustomSize(sizeSearch);
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Use "{sizeSearch}" as custom size
                        </button>
                      ) : (
                        'No sizes found'
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-2" />

            {/* Alignment Dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <MenuButton 
                onClick={() => toggleDropdown('align')} 
                active={showAlignDropdown}
                tooltip="Text Alignment"
              >
                <div className="flex items-center gap-1">
                  {(() => {
                    const activeAlignment = alignments.find(a => a.active());
                    const IconComponent = activeAlignment?.icon || AlignLeft;
                    return <IconComponent size={16} />;
                  })()}
                  <ChevronDown size={12} />
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

            <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-2" />

            {/* List Controls */}
            <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} tooltip="Bullet List">
              <List size={16} />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} tooltip="Numbered List">
              <ListOrdered size={16} />
            </MenuButton>

            <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-2" />

            {/* Additional Tools */}
            <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} tooltip="Quote">
              <Quote size={16} />
            </MenuButton>
            <MenuButton onClick={addLink} active={editor.isActive('link')} tooltip="Add Link">
              <LinkIcon size={16} />
            </MenuButton>
            <MenuButton onClick={addImage} tooltip="Add Image">
              <ImageIcon size={16} />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} tooltip="Horizontal Line">
              <Minus size={16} />
            </MenuButton>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right-aligned Controls */}
            <MenuButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} tooltip="Clear Formatting">
              <Eraser size={16} />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} tooltip="Undo">
              <Undo size={16} />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} tooltip="Redo">
              <Redo size={16} />
            </MenuButton>
          </div>

          <EditorContent 
            editor={editor} 
            className="prose prose-sm dark:prose-invert max-w-none p-4 focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px] [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 dark:[&_blockquote]:text-gray-400 [&_hr]:border-gray-300 [&_hr]:my-4"
            style={{ minHeight }}
            onClick={closeAllDropdowns}
          />
          
          {/* Formatting Status Panel */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 px-4 py-2">
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
              {getFormattingInfo().length > 0 ? (
                getFormattingInfo().map((item, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <span className="font-medium text-gray-500 dark:text-gray-500">{item.label}:</span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item.value}</span>
                    {index < getFormattingInfo().length - 1 && (
                      <span className="text-gray-400 dark:text-gray-600 ml-2">•</span>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-gray-500 dark:text-gray-500">No formatting applied</span>
              )}
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
"use client";

import React, { useRef, useEffect, useState } from "react";
import { Palette, ALargeSmall, Trash2 } from "lucide-react";
import { SketchPicker, ColorResult } from "react-color";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const savedRange = useRef<Range | null>(null);
    const [color, setColor] = useState({ r: 0, g: 0, b: 0, a: 1 });
    const [showColorPicker, setShowColorPicker] = useState(false);
    
    // Sync initial value mainly on key changes or empty
    useEffect(() => {
        if (editorRef.current && value && editorRef.current.innerHTML === "") {
             editorRef.current.innerHTML = value;
        }
    }, [value]);

    const handleInput = () => {
        saveSelection();
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const saveSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
                savedRange.current = range.cloneRange();
            }
        }
    };

    const restoreSelection = () => {
        const selection = window.getSelection();
        if (selection && savedRange.current) {
            selection.removeAllRanges();
            selection.addRange(savedRange.current);
        }
    };

    const applyColor = (colorResult: ColorResult) => {
        const { r, g, b, a = 1 } = colorResult.rgb;
        const rgba = `rgba(${r}, ${g}, ${b}, ${a})`;
        setColor({ r, g, b, a });
        
        restoreSelection();
        if (!savedRange.current) return;
        
        const range = savedRange.current;
        if (range.collapsed) return;

        // DOM Modification Logic
        // check if we are updating an existing span (live drag)
        let targetSpan: HTMLSpanElement | null = null;
        
        // Check element directly or parent
        const container = range.commonAncestorContainer;
        const parent = container.parentElement;

        if (container.nodeType === Node.ELEMENT_NODE && (container as HTMLElement).tagName === 'SPAN') {
            targetSpan = container as HTMLSpanElement;
        } else if (parent && parent.tagName === 'SPAN') {
            targetSpan = parent as HTMLSpanElement;
        }
        
        // If we found a span wrapper, just update it
        if (targetSpan) {
            targetSpan.style.color = rgba;
            handleInput();
        } else {
            // First time wrapping
            try {
                 const span = document.createElement('span');
                 span.style.color = rgba;
                 span.appendChild(range.extractContents());
                 range.insertNode(span);
                 
                 // Update selection to be inside new span so subsequent drag updates work
                 const newRange = document.createRange();
                 newRange.selectNodeContents(span);
                 savedRange.current = newRange.cloneRange();
                 
                 const sel = window.getSelection();
                 if (sel) {
                     sel.removeAllRanges();
                     sel.addRange(newRange);
                 }
                 
                 handleInput();
            } catch (e) {
                console.error("Failed to apply color", e);
            }
        }
    };

    const applyFont = (fontClass: string) => {
        restoreSelection();
        if (!savedRange.current) return;
        const range = savedRange.current;
        if (range.collapsed) return;

        const span = document.createElement('span');
        span.className = fontClass;

        try {
             span.appendChild(range.extractContents());
             range.insertNode(span);
             handleInput();
        } catch (e) {
            console.error("Failed to apply font", e);
        }
    };

    return (
        <div className={cn("border rounded-md overflow-hidden bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2", className)}>
            <div className="bg-muted/50 border-b p-2 flex items-center gap-2">
                
                {/* Font Family Picker */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 gap-2 px-2" title="Font Family">
                            <ALargeSmall className="h-4 w-4" />
                            <span className="text-xs font-medium hidden sm:inline-block">Font</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-1" align="start">
                        <div className="space-y-1">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full justify-start font-sans"
                                onClick={() => applyFont('font-sans')}
                            >
                                Poppins (Default)
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full justify-start font-playfair"
                                onClick={() => applyFont('font-playfair')}
                            >
                                Playfair Display
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>

                <div className="w-px h-4 bg-border mx-1" />

                {/* Color Picker */}
                <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
                    <PopoverTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            title="Text Color"
                        >
                            <Palette 
                                className="h-4 w-4" 
                                style={{ color: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})` }} 
                            />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                        className="w-auto p-0 border-none shadow-none z-50" 
                        side="top" 
                        align="center"
                        onFocusOutside={(e) => e.preventDefault()}
                    >
                        <SketchPicker 
                            color={color}
                            onChange={applyColor} 
                        />
                    </PopoverContent>
                </Popover>

                <div className="w-px h-4 bg-border mx-1" />

                {/* Clear Formatting */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="Clear Formatting"
                    onClick={() => {
                        restoreSelection();
                        document.execCommand('removeFormat');
                        handleInput();
                    }}
                >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>

                <span className="text-xs text-muted-foreground ml-auto pr-2">
                    Select text to style
                </span>
            </div>
            
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onMouseUp={saveSelection}
                onKeyUp={saveSelection}
                onBlur={saveSelection}
                onPaste={(e) => {
                    e.preventDefault();
                    const html = e.clipboardData.getData('text/html');
                    const text = e.clipboardData.getData('text/plain');
                    
                    if (html) {
                        // Strip background-color styles from pasted HTML
                        const cleanHtml = html
                            .replace(/background(-color)?:\s*[^;]+;?/gi, '')
                            .replace(/style=""/gi, '');
                        document.execCommand('insertHTML', false, cleanHtml);
                    } else {
                        document.execCommand('insertText', false, text);
                    }
                    handleInput();
                }}
                className={cn(
                    "p-3 min-h-[80px] outline-none text-lg font-medium max-h-[300px] overflow-y-auto bg-background text-neutral-900 dark:text-white",
                    "placeholder:text-muted-foreground",
                    "[&_*]:!bg-transparent" // Force no background on all child elements
                )}
                spellCheck={false}
            />
        </div>
    );
}

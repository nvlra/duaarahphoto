"use client"

import { useState, useRef, useEffect } from "react"
// Framer Motion removed
import { 
  Plus, Trash2, GripVertical, Type, Image as ImageIcon, 
  RotateCcw, Save, Download, LayoutTemplate, 
  ChevronDown, ChevronUp, Palette, Grid3X3, Bold, Italic, Underline,
  Move, ZoomIn, ZoomOut, Settings, Upload, ArrowLeft 
} from "lucide-react"
import * as LucideIcons from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

// Types
interface InvoiceElement {
  id: string
  type: 'text' | 'icon'
  content: string
  x: number
  y: number
  fontSize?: number
  fontWeight?: 'normal' | 'bold'
  fontStyle?: 'normal' | 'italic'
  initialX?: number
  initialY?: number
  hasLanded?: boolean
}


// Helper Component for Draggable Blocks 
// Helper Component for Draggable Blocks 
function DraggableBlock({ 
  children, 
  className = "", 
  onColorChange, 
  currentColor, 
  id,
  isSelected,
  onSelect,
  onDelete,
  x, 
  y,
  scale = 1,
  orientation = 'portrait',
  onUpdatePosition,
  otherElements = [],
  guideLinesRef,
  showGrid = false
}: { 
  children: React.ReactNode, 
  className?: string, 
  onColorChange?: (c: string) => void, 
  currentColor?: string, 
  id: string,
  isSelected: boolean,
  onSelect: (id: string) => void,
  onDelete?: () => void,
  x?: number,
  y?: number,
  scale?: number,
  orientation?: 'portrait' | 'landscape',
  onUpdatePosition?: (id: string, x: number, y: number) => void,
  otherElements?: InvoiceElement[],
  guideLinesRef?: React.RefObject<{ vertical: HTMLDivElement | null, horizontal: HTMLDivElement | null }>,
  showGrid?: boolean
}) {
  const elementRef = useRef<HTMLDivElement>(null);

  // Initialize position from props to avoid 0,0 jump
  useEffect(() => {
    if (elementRef.current && x !== undefined && y !== undefined) {
        elementRef.current.style.transform = `translate(${x}px, ${y}px)`;
        // Initialize dataset for robust reading
        elementRef.current.dataset.lastX = x.toString();
        elementRef.current.dataset.lastY = y.toString();
    }
  }, [x, y]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent text selection
    onSelect(id);
    
    // Safety check
    if (!elementRef.current || !guideLinesRef?.current) return;
    
    const element = elementRef.current;
    
    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = x ?? 0;
    const initialY = y ?? 0;
    const scaleVal = scale || 1;

    const onPointerMove = (moveEvent: PointerEvent) => {
        const deltaX = (moveEvent.clientX - startX) / scaleVal;
        const deltaY = (moveEvent.clientY - startY) / scaleVal;
        
        const currentX = initialX + deltaX;
        const currentY = initialY + deltaY;
        
        // 1. Direct Visual Update
        element.style.transform = `translate(${currentX}px, ${currentY}px)`;
        
        // 2. Snapping Logic
        const elRect = element.getBoundingClientRect();
        const width = elRect.width / scaleVal;
        const height = elRect.height / scaleVal;
        const midX = currentX + (width / 2);
        
        const THRESHOLD = 20; // Increased for easier snapping 
        let showVert = false;
        let showHorz = false;
        let snappedX = currentX;
        let snappedY = currentY;

        const PADDING = 60; // Canvas padding
        const pageCenterX = (orientation === 'portrait' ? 794 - PADDING * 2 : 1123 - PADDING * 2) / 2;
        const canvasW = orientation === 'portrait' ? 794 - PADDING * 2 : 1123 - PADDING * 2;
        const canvasH = orientation === 'portrait' ? 1123 - PADDING * 2 : 794 - PADDING * 2;

        // --- X AXIS SNAPPING ---
        // 1. Center Snap
        if (Math.abs(midX - pageCenterX) < THRESHOLD) {
            snappedX = pageCenterX - (width / 2);
            if (guideLinesRef.current!.vertical) {
                guideLinesRef.current!.vertical.style.left = `${pageCenterX}px`;
                guideLinesRef.current!.vertical.style.opacity = '1';
            }
            showVert = true;
        } 
        // 2. Page Edge Snap
        else if (Math.abs(currentX - 0) < THRESHOLD) {
            snappedX = 0;
            if (guideLinesRef.current!.vertical) {
                guideLinesRef.current!.vertical.style.left = `0px`;
                guideLinesRef.current!.vertical.style.opacity = '1';
            }
            showVert = true;
        }
        else if (Math.abs((currentX + width) - canvasW) < THRESHOLD) {
            snappedX = canvasW - width;
            if (guideLinesRef.current!.vertical) {
                guideLinesRef.current!.vertical.style.left = `${canvasW}px`;
                guideLinesRef.current!.vertical.style.opacity = '1';
            }
            showVert = true;
        }
        // 3. Element Snap
        else {
            for (const other of otherElements) {
                if (other.id === id) continue;
                const otherEl = document.getElementById(other.id);
                if (!otherEl) continue;
                
                // Note: We use the stored state position (other.x) for reference, not the live DOM to avoid jank
                const otherR = other.x + (document.getElementById(other.id)?.getBoundingClientRect().width || 0) / scaleVal;

                // Left-Left
                if (Math.abs(currentX - other.x) < THRESHOLD) {
                    snappedX = other.x;
                    if (guideLinesRef.current!.vertical) {
                        guideLinesRef.current!.vertical.style.left = `${other.x}px`;
                        guideLinesRef.current!.vertical.style.opacity = '1';
                    }
                    showVert = true;
                    break;
                }
                // Right-Left (Adjacency)
                if (Math.abs((currentX + width) - other.x) < THRESHOLD) {
                    snappedX = other.x - width;
                    if (guideLinesRef.current!.vertical) {
                        guideLinesRef.current!.vertical.style.left = `${other.x}px`;
                        guideLinesRef.current!.vertical.style.opacity = '1';
                    }
                    showVert = true;
                    break;
                }
                // Left-Right (Adjacency)
                if (Math.abs(currentX - otherR) < THRESHOLD) {
                    snappedX = otherR;
                    if (guideLinesRef.current!.vertical) {
                        guideLinesRef.current!.vertical.style.left = `${otherR}px`;
                        guideLinesRef.current!.vertical.style.opacity = '1';
                    }
                    showVert = true;
                    break;
                }
                
                // Center-Center (Horizontal alignment)
                const otherMidX = other.x + ((document.getElementById(other.id)?.getBoundingClientRect().width || 0) / scaleVal) / 2;
                if (Math.abs(midX - otherMidX) < THRESHOLD) {
                    snappedX = otherMidX - (width / 2);
                    if (guideLinesRef.current!.vertical) {
                        guideLinesRef.current!.vertical.style.left = `${otherMidX}px`;
                        guideLinesRef.current!.vertical.style.opacity = '1';
                    }
                    showVert = true;
                    break;
                }
            }
        }

        // --- Y AXIS SNAPPING ---
        // 1. Page Edge Snap
        if (Math.abs(currentY - 0) < THRESHOLD) {
            snappedY = 0;
            if (guideLinesRef.current!.horizontal) {
                guideLinesRef.current!.horizontal.style.top = `0px`;
                guideLinesRef.current!.horizontal.style.opacity = '1';
            }
            showHorz = true;
        }
        else if (Math.abs((currentY + height) - canvasH) < THRESHOLD) {
            snappedY = canvasH - height;
            if (guideLinesRef.current!.horizontal) {
                guideLinesRef.current!.horizontal.style.top = `${canvasH}px`;
                guideLinesRef.current!.horizontal.style.opacity = '1';
            }
            showHorz = true;
        }
        // 2. Element Snap
        else {
            for (const other of otherElements) {
                if (other.id === id) continue;
                const otherEl = document.getElementById(other.id);
                if (!otherEl) continue;

                // Estimate height from DOM or state? State only has x/y. DOM is needed for width/height.
                const otherRect = otherEl.getBoundingClientRect();
                const otherH = otherRect.height / scaleVal;
                const otherB = other.y + otherH;

                // Top-Top
                if (Math.abs(currentY - other.y) < THRESHOLD) {
                    snappedY = other.y;
                    if (guideLinesRef.current!.horizontal) {
                        guideLinesRef.current!.horizontal.style.top = `${other.y}px`;
                        guideLinesRef.current!.horizontal.style.opacity = '1';
                    }
                    showHorz = true;
                    break;
                }
                // Bottom-Top (Adjacency)
                if (Math.abs((currentY + height) - other.y) < THRESHOLD) {
                    snappedY = other.y - height;
                    if (guideLinesRef.current!.horizontal) {
                        guideLinesRef.current!.horizontal.style.top = `${other.y}px`;
                        guideLinesRef.current!.horizontal.style.opacity = '1';
                    }
                    showHorz = true;
                    break;
                }
                // Top-Bottom (Adjacency)
                if (Math.abs(currentY - otherB) < THRESHOLD) {
                    snappedY = otherB;
                    if (guideLinesRef.current!.horizontal) {
                        guideLinesRef.current!.horizontal.style.top = `${otherB}px`;
                        guideLinesRef.current!.horizontal.style.opacity = '1';
                    }
                    showHorz = true;
                    break;
                }
                
                // Center-Center (Vertical alignment)
                const midY = currentY + (height / 2);
                const otherMidY = other.y + (otherH / 2);
                if (Math.abs(midY - otherMidY) < THRESHOLD) {
                    snappedY = otherMidY - (height / 2);
                    if (guideLinesRef.current!.horizontal) {
                        guideLinesRef.current!.horizontal.style.top = `${otherMidY}px`;
                        guideLinesRef.current!.horizontal.style.opacity = '1';
                    }
                    showHorz = true;
                    break;
                }
            }
        }

        // Clamp
        if (snappedX < 0) snappedX = 0;
        if (snappedX + width > canvasW) snappedX = canvasW - width;
        if (snappedY < 0) snappedY = 0;
        if (snappedY + height > canvasH) snappedY = canvasH - height;

        // Apply Snap
        element.style.transform = `translate(${snappedX}px, ${snappedY}px)`;
        element.dataset.lastX = snappedX.toString();
        element.dataset.lastY = snappedY.toString();

        if (!showVert && guideLinesRef.current!.vertical) guideLinesRef.current!.vertical.style.opacity = '0';
        if (!showHorz && guideLinesRef.current!.horizontal) guideLinesRef.current!.horizontal.style.opacity = '0';
    };

    const onPointerUp = (upEvent: PointerEvent) => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        
        const finalX = parseFloat(element.dataset.lastX || (x ?? 0).toString());
        const finalY = parseFloat(element.dataset.lastY || (y ?? 0).toString());

        onUpdatePosition?.(id, finalX, finalY);
        
        if (guideLinesRef.current?.vertical) guideLinesRef.current.vertical.style.opacity = '0';
        if (guideLinesRef.current?.horizontal) guideLinesRef.current.horizontal.style.opacity = '0';
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const isDraggable = x !== undefined && y !== undefined;
  
  return (
    <div
      ref={elementRef}
      id={id} // Crucial for document.getElementById lookup
      onPointerDown={isDraggable ? handlePointerDown : undefined}
      onClick={(e) => {
         e.stopPropagation()
         onSelect(id)
      }}
      className={`${isDraggable ? 'absolute' : 'relative'} group/drag rounded p-1 ${isSelected ? 'border border-blue-500 ring-2 ring-blue-100 z-50' : 'border border-transparent'} ${className}`}
      style={{ color: currentColor, ...(isDraggable ? { position: 'absolute', top: 0, left: 0, cursor: isSelected ? 'grab' : 'pointer' } : {}) }} 
    >
      {/* Drag Handle & Controls - Visible ONLY when Selected */}
      {isSelected && (
         <div className="absolute -top-3 -left-3 flex gap-1 z-50">
            <div 
                className="cursor-move p-1.5 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200 shadow-sm border border-blue-200"
            >
               <Move className="h-3 w-3" />
            </div>
            {onColorChange && (
               <Popover>
                    <PopoverTrigger asChild>
                        <div className="group/color cursor-pointer p-1.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 shadow-sm flex items-center justify-center">
                            <Palette className="h-3 w-3" />
                            <div className="absolute inset-0 rounded-full" style={{ backgroundColor: currentColor, opacity: 0.2 }}></div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3" align="start">
                         <div className="space-y-2">
                            <div className="text-xs font-semibold text-muted-foreground">Pilih Warna</div>
                            <HexColorPicker color={currentColor?.startsWith('#') ? currentColor : '#000000'} onChange={onColorChange} />
                            <Input 
                                value={currentColor} 
                                onChange={(e) => onColorChange(e.target.value)}
                                className="h-8 text-xs uppercase"
                            />
                         </div>
                    </PopoverContent>
               </Popover>
            )}
            {onDelete && (
               <div 
                  onClick={(e) => {
                     e.stopPropagation()
                     onDelete()
                  }}
                  className="cursor-pointer p-1.5 bg-white border border-red-200 rounded-full text-red-500 hover:bg-red-50 shadow-sm flex items-center justify-center"
               >
                  <Trash2 className="h-3 w-3" />
               </div>
            )}
         </div>
      )}
      {children}
    </div>
  )
}

// Render Helper
const RenderIcon = ({ name, size = 24 }: { name: string, size?: number }) => {
  // @ts-expect-error - Dynamic icon access
  const Icon = LucideIcons[name]
  return Icon ? <Icon size={size} /> : null
}

// --- EXTRACTED CONTROLS COMPONENTS ---

interface AppearanceControlsProps {
  template: string
  setTemplate: (val: string) => void
  font: string
  setFont: (val: string) => void
  tableHeaderBg: string
  setTableHeaderBg: (val: string) => void
  tableTextColor: string
  setTableTextColor: (val: string) => void
}

import { HexColorPicker } from "react-colorful"

const BASIC_COLORS = [
  "#ffffff", // White
  "#f1f5f9", // Slate 100
  "#94a3b8", // Slate 400
  "#1e293b", // Slate 800
  "#000000", // Black
]

const ColorSwatch = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const isCustomValue = !BASIC_COLORS.includes(value)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
         <span className="text-xs text-muted-foreground block">{label}</span>
         {isExpanded && (
             <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">Hex:</span>
                <input 
                    type="text" 
                    value={value} 
                    onChange={(e) => onChange(e.target.value)}
                    className="w-16 h-6 text-[10px] border border-slate-200 rounded px-1 focus:outline-none focus:border-blue-500 uppercase"
                />
             </div>
         )}
      </div>
      
      <div className="flex flex-wrap gap-2 relative">
         {/* Basic Presets (Always Visible) */}
         {BASIC_COLORS.map((color) => (
             <button
                key={color}
                onClick={() => onChange(color)}
                className={`w-8 h-8 rounded-full border border-slate-200 shadow-sm transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-slate-400 ${value === color ? 'ring-2 ring-slate-900 ring-offset-1 scale-110' : ''}`}
                style={{ backgroundColor: color }}
                title={color}
             />
         ))}

         {/* Expand/Collapse Trigger (Palette Icon) */}
         <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`relative w-8 h-8 rounded-full border shadow-sm overflow-hidden flex items-center justify-center group cursor-pointer transition-all hover:scale-110 ${isExpanded || isCustomValue ? 'ring-2 ring-blue-500 ring-offset-1 scale-110 border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}
            title="Custom Color"
         >
            {isExpanded ? (
                <span className="text-lg leading-none text-slate-600 font-bold">-</span>
            ) : isCustomValue ? (
                <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: value }} />
            ) : (
                <Palette className="w-4 h-4 text-slate-600" />
            )}
         </button>
      </div>

       {/* React Colorful Picker */}
       {isExpanded && (
           <div className="mt-3">
               <HexColorPicker color={value} onChange={onChange} style={{ width: '100%', height: '150px' }} />
           </div>
       )}
    </div>
  )
}

// ... (Settings Control Implementation)



const AppearanceControls = ({ 
  template, setTemplate, font, setFont, tableHeaderBg, setTableHeaderBg, tableTextColor, setTableTextColor 
}: AppearanceControlsProps) => {
  return (
    <div className="space-y-4">
        <div className="space-y-3">
            <div className="space-y-1">
                <Label className="text-xs">Template</Label>
                <Select value={template} onValueChange={setTemplate}>
                    <SelectTrigger className="h-9 text-xs w-full"><SelectValue /></SelectTrigger>
                    <SelectContent className="z-[300]">
                        <SelectItem value="modern">Modern Minimalis</SelectItem>
                        <SelectItem value="bold">Bold Header</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="space-y-1">
                <Label className="text-xs">Font</Label>
                <Select value={font} onValueChange={setFont}>
                    <SelectTrigger className="h-9 text-xs w-full"><SelectValue /></SelectTrigger>
                    <SelectContent className="z-[300]">
                        <SelectItem value="font-sans">Inter (Default)</SelectItem>
                        <SelectItem value="font-poppins">Poppins (Modern)</SelectItem>
                        <SelectItem value="font-roboto">Roboto (Standard)</SelectItem>
                        <SelectItem value="font-montserrat">Montserrat (Clean)</SelectItem>
                        <SelectItem value="font-playfair">Playfair (Elegant Serif)</SelectItem>
                        <SelectItem value="font-serif">Merriweather (Classic Serif)</SelectItem>
                        <SelectItem value="font-mono">Mono</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-2 border-t border-slate-100">
            <ColorSwatch label="Warna Header Tabel" value={tableHeaderBg} onChange={setTableHeaderBg} />
            <ColorSwatch label="Warna Teks Header" value={tableTextColor} onChange={setTableTextColor} />
        </div>
    </div>
  )
}

interface ElementsControlsProps {
  addCustomIcon: (icon: string, e?: React.MouseEvent) => void
  addTextElement: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  logoSize: number
  setLogoSize: (size: number) => void
}

const ElementsControls = ({ addCustomIcon, addTextElement, fileInputRef, handleLogoUpload, logoSize, setLogoSize }: ElementsControlsProps) => (
  <div className="space-y-3">
      <div className="space-y-2">
         <Label className="text-xs">Elemen</Label>
         <div className="grid grid-cols-1 gap-2">
             <Button variant="outline" className="h-10 justify-start bg-white px-6" onClick={addTextElement}>
                 <Type className="mr-2 h-4 w-4" /> Tambah Teks
             </Button>
         </div>
      </div>

      <div className="space-y-2">
         <Label className="text-xs">Ikon Tambahan</Label>
          <div className="grid grid-cols-4 gap-2">
              {['Camera', 'Aperture', 'Image', 'Film', 'MapPin', 'Phone', 'Mail', 'Globe'].map(icon => (
                  <Button key={icon} variant="outline" size="icon" className="h-9 w-9" onClick={(e) => addCustomIcon(icon, e)}>
                  <RenderIcon name={icon} size={16} />
                  </Button>
              ))}
          </div>
      </div>
      <Separator />
      
      {/* Only show upload on general elements control, mobile has direct access */}
      <div className="space-y-2 lg:block hidden">
          <Label className="text-xs">Logo</Label>
          <div className="space-y-2">
             <div className="border-2 border-dashed rounded-lg p-3 text-center hover:bg-muted/50 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                 <Upload className="h-5 w-5 text-muted-foreground mx-auto" />
                 <span className="text-[10px] text-muted-foreground">Upload Logo</span>
                 <Input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
             </div>
              <div className="space-y-1">
                 <div className="flex justify-between">
                    <span className="text-[10px] text-muted-foreground">Ukuran Logo</span>
                    <span className="text-[10px] text-muted-foreground">{logoSize}px</span>
                 </div>
                 <input 
                    type="range" 
                    min="32" 
                    max="200" 
                    value={logoSize} 
                    onChange={(e) => setLogoSize(Number(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                 />
              </div>
          </div>
      </div>
  </div>
)

interface SettingsControlsProps {
    showGrid: boolean
    setShowGrid: (val: boolean) => void
    orientation: 'portrait' | 'landscape'
    setOrientation: React.Dispatch<React.SetStateAction<'portrait' | 'landscape'>>
    bgColor: string
    setBgColor: (val: string) => void
    showStamp: boolean
    setShowStamp: (val: boolean) => void
    stampText: string
    setStampText: (val: string) => void
    stampColor: string
    setStampColor: (val: string) => void
    stampSize: number
    setStampSize: (val: number) => void
}

const SettingsControls = ({ 
  showGrid, setShowGrid, orientation, setOrientation, bgColor, setBgColor, showStamp, setShowStamp, stampText, setStampText, stampColor, setStampColor, stampSize, setStampSize
}: SettingsControlsProps) => (
  <div className="space-y-3">
      <div className="flex items-center justify-between">
          <div className="flex flex-col">
              <span className="text-xs font-medium">Auto Snap Grid</span>
              <span className="text-[10px] text-muted-foreground">Luruskan elemen</span>
          </div>
          <Switch checked={showGrid} onCheckedChange={setShowGrid} className="scale-75 origin-right" />
      </div>

      <div className="flex items-center justify-between">
           <div className="flex flex-col">
              <span className="text-xs font-medium">Orientasi</span>
              <span className="text-[10px] text-muted-foreground">Portrait / Landscape</span>
          </div>
          <div className="flex items-center border rounded-lg p-1 bg-slate-50">
              <button 
                  onClick={() => setOrientation('portrait')}
                  className={`p-1.5 rounded-md transition-all ${orientation === 'portrait' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Portrait"
              >
                  <LayoutTemplate className="h-4 w-4" />
              </button>
              <button 
                  onClick={() => setOrientation('landscape')}
                  className={`p-1.5 rounded-md transition-all ${orientation === 'landscape' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Landscape"
              >
                  <LayoutTemplate className="h-4 w-4 rotate-90" />
              </button>
          </div>
      </div>

      <Separator className="my-2" />

      <div className="space-y-3">
          <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Watermark / Cap</span>
              <Switch checked={showStamp} onCheckedChange={setShowStamp} className="scale-75 origin-right" />
          </div>
          
          {showStamp && (
              <div className="space-y-3 pt-2 animate-in slide-in-from-top-2">
                  <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Teks Cap</Label>
                      <Input 
                          value={stampText} 
                          onChange={(e) => setStampText(e.target.value)} 
                          className="h-8 text-xs" 
                          placeholder="LUNAS, DRAFT, dll"
                      />
                  </div>
                  
              <div className="space-y-1">
                  <div className="flex justify-between">
                     <Label className="text-[10px] text-muted-foreground">Ukuran Cap</Label>
                     <span className="text-[10px] text-muted-foreground">{stampSize}px</span>
                  </div>
                  <input 
                     type="range" 
                     min="12" 
                     max="200" 
                     value={stampSize} 
                     onChange={(e) => setStampSize(Number(e.target.value))}
                     className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
              </div>
          
              {/* Replaced Native Picker with ColorSwatch */}
              <ColorSwatch label="Warna Cap" value={stampColor} onChange={setStampColor} />
          </div>
          )}
      </div>
  </div>
)

export function InvoiceEditor({ onBack }: { onBack?: () => void }) {
  // State
  const [font, setFont] = useState("font-sans")
  const [template, setTemplate] = useState("modern")
  
  // Invoice Data State
  const [invoiceData, setInvoiceData] = useState({
    title: "INVOICE",
    number: "#INV-2025-001",
    companyName: "Enviel Photography",
    companyDetails: "admin@enviel.com\n+62 812 3456 7890",
    billToLabel: "Bill To:",
    clientName: "Bapak Budi Santoso",
    clientAddress: "Jl. Sudirman No 45, Jakarta",
    dateLabel: "Date:",
    dateValue: "Dec 13, 2025",
    dueLabel: "Due Date:",
    dueValue: "Dec 20, 2025",
    notes: "Thank you for your business!",
    // Colors per section
    headerColor: "text-slate-900",
    companyColor: "text-slate-900",
    billToColor: "text-slate-900",
    datesColor: "text-slate-900",
    totalColor: "#2563eb",
  })
  
  // Table Style State
  const [tableHeaderBg, setTableHeaderBg] = useState("#f1f5f9") // slate-100
  const [tableTextColor, setTableTextColor] = useState("#334155") // slate-700
  
  // Save State
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [templateName, setTemplateName] = useState("")

  // Auto Layout / Snap Grid State
  const [showGrid, setShowGrid] = useState(false)

  const [items, setItems] = useState([
    { id: 1, desc: "Wedding Documentation (Gold Package)", amount: "Rp 15.000.000" },
    { id: 2, desc: "Additional Photobook", amount: "Rp 2.500.000" },
  ])

  // Custom added elements (icons/text)
  const [customElements, setCustomElements] = useState<InvoiceElement[]>([])
  
  // Smart Guides Ref (Direct DOM manipulation for performance)
  const guideLinesRef = useRef<{ vertical: HTMLDivElement | null, horizontal: HTMLDivElement | null }>({ vertical: null, horizontal: null })
  
  // Stempel / Watermark State
  const [showStamp, setShowStamp] = useState(false)
  const [stampText, setStampText] = useState("LUNAS")
  const [stampColor, setStampColor] = useState("#22c55e") // Default Green
  const [stampSize, setStampSize] = useState(96) // Default 96px (text-8xl approx)
  const [logo, setLogo] = useState<string | null>(null)
  const [logoSize, setLogoSize] = useState(64) // Default h-16 (64px)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [bgColor, setBgColor] = useState('#ffffff')
  
  // Scaling State
  const [scale, setScale] = useState(1)
  const [activePopover, setActivePopover] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const togglePopover = (name: string) => {
    setActivePopover(activePopover === name ? null : name)
  }

  // Auto Scale Logic
  useEffect(() => {
    const handleResize = () => {
        if (!containerRef.current) return;
        
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        // A4 Dimensions in px (at 96 DPI)
        const targetWidth = orientation === 'portrait' ? 794 : 1123; 
        const targetHeight = orientation === 'portrait' ? 1123 : 794;
        
        // Dynamic padding
        const isMobile = window.innerWidth < 768;
        const padding = isMobile ? 16 : 48; 
        
        const availableWidth = containerWidth - padding;
        const availableHeight = containerHeight - padding;
        
        // Calculate Scales separately
        const scaleX = availableWidth / targetWidth;
        const scaleY = availableHeight / targetHeight;

        // Use the smaller scale to ensure it FITS ENTIRELY (contain)
        let newScale = Math.min(scaleX, scaleY);
        
        // Cap scale to reasonable limits
        if (newScale > 1.5) newScale = 1.5; 
        
        setScale(newScale);
    };

    // Initial calc
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [orientation]);

  // Keyboard Delete Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't delete element if user is typing in an input
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        return; // User is editing text, don't delete element
      }
      
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        setCustomElements(prev => prev.filter(el => el.id !== selectedId))
        setSelectedId(null)
        toast.info("Elemen Dihapus")
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId])

  // Handlers
  const handleInputChange = (key: keyof typeof invoiceData, value: string) => {
    setInvoiceData(prev => ({ ...prev, [key]: value }))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setLogo(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const addCustomIcon = (iconName: string, e?: React.MouseEvent) => {
    const newEl: InvoiceElement = {
      id: `icon-${new Date().getTime()}`,
      type: 'icon',
      content: iconName,
      x: 250, 
      y: 200, 
      fontSize: 24
    }
    setCustomElements([...customElements, newEl])
    setSelectedId(newEl.id)
    toast.success("Icon Ditambahkan")
  }

  const addTextElement = () => {
   const newEl: InvoiceElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: 'Triple click to edit',
      x: 50,
      y: 100,
      fontSize: 16,
      fontWeight: 'normal',
      fontStyle: 'normal'
   }
   setCustomElements([...customElements, newEl])
   setSelectedId(newEl.id)
   toast.success("Teks Ditambahkan")
  }

  const removeCustomElement = (id: string) => {
    setCustomElements(customElements.filter(e => e.id !== id))
    toast.info("Elemen Dihapus")
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col md:gap-4 gap-2 relative">
      <div className="flex items-center justify-between shrink-0 px-1 md:px-0">
        <div className="flex items-center gap-4">
           <Button variant="outline" size="icon" onClick={onBack}>
               <ArrowLeft className="h-4 w-4" />
           </Button>
           <div>
              <h2 className="text-xl md:text-3xl font-bold tracking-tight">Desain Invoice</h2>
              <p className="text-xs md:text-base text-muted-foreground hidden md:block">Klik teks di invoice untuk mengedit langsung.</p>
           </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 md:h-10" onClick={() => {
                setCustomElements([])
                setLogo(null)
            }}>
               <RotateCcw className="mr-2 h-3 w-3 md:h-4 md:w-4" /> Reset
            </Button>
             
             <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                <DialogTrigger asChild>
                   <Button size="sm" className="h-8 md:h-10">
                      <Save className="mr-2 h-3 w-3 md:h-4 md:w-4" /> Simpan
                   </Button>
                </DialogTrigger>
                <DialogContent>
                   <DialogHeader>
                      <DialogTitle>Simpan Template</DialogTitle>
                      <DialogDescription>
                         Beri nama untuk template invoice ini agar mudah dicari nanti.
                      </DialogDescription>
                   </DialogHeader>
                   <div className="py-4">
                      <Label className="mb-2 block">Nama Template</Label>
                      <Input 
                         value={templateName} 
                         onChange={(e) => setTemplateName(e.target.value)} 
                         placeholder="Contoh: Invoice Corporate Modern..."
                      />
                   </div>
                   <DialogFooter>
                      <Button onClick={() => {
                         setIsSaveDialogOpen(false)
                         toast.success("Template Berhasil Disimpan", {
                            description: `Template "${templateName}" telah disimpan ke koleksi anda.`,
                         })
                      }}>Simpan</Button>
                   </DialogFooter>
                </DialogContent>
             </Dialog>
        </div>
      </div>

      {/* Main Content Area - Split Layout */}
      <div className="flex-1 flex gap-0 lg:gap-6 overflow-hidden relative">
        
        {/* === DESKTOP SIDEBAR - Hidden on Mobile === */}
        <Card className="hidden lg:flex lg:col-span-3 h-full overflow-y-auto flex-col w-[300px] flex-none">
          <CardHeader>
            <CardTitle>Tools</CardTitle>
            <CardDescription>Drag & Drop element ke invoice.</CardDescription>
          </CardHeader>
          <ScrollArea className="flex-1">
          <CardContent className="space-y-6">
             <AppearanceControls 
                template={template} setTemplate={setTemplate}
                font={font} setFont={setFont}
                tableHeaderBg={tableHeaderBg} setTableHeaderBg={setTableHeaderBg}
                tableTextColor={tableTextColor} setTableTextColor={setTableTextColor}
             />
             <Separator />
             <SettingsControls 
                showGrid={showGrid} setShowGrid={setShowGrid}
                orientation={orientation} setOrientation={setOrientation}
                bgColor={bgColor} setBgColor={setBgColor}
                showStamp={showStamp} setShowStamp={setShowStamp}
                stampText={stampText} setStampText={setStampText}
                stampColor={stampColor} setStampColor={setStampColor}
                stampSize={stampSize} setStampSize={setStampSize}
             />
             <Separator />
             <ElementsControls  
                addCustomIcon={addCustomIcon}
                addTextElement={addTextElement}
                fileInputRef={fileInputRef}
                handleLogoUpload={handleLogoUpload}
                logoSize={logoSize}
                setLogoSize={setLogoSize}
             />
          </CardContent>
          </ScrollArea>
        </Card>

         {/* Canvas Scroll Container */}
         {/* Reduced mobile padding from p-4 to p-1 to allow max width */}
         <div ref={containerRef} className="flex-1 bg-muted/30 lg:bg-muted/30 rounded-lg overflow-y-auto overflow-x-hidden flex items-start justify-center p-4 lg:p-8 relative" onClick={() => setSelectedId(null)}>
             
             {/* Zoom Controls - Floating */}
             {/* Mobile: Fixed bottom right (aligned with toolbar) to avoid covering canvas header */}
             {/* Desktop: Absolute top right of container */}
             <div className="fixed bottom-28 right-4 lg:absolute lg:top-4 lg:right-4 lg:bottom-auto z-[100] flex flex-col gap-2 bg-popover text-popover-foreground rounded-lg shadow-md border border-border p-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent hover:text-accent-foreground" onClick={(e) => { e.stopPropagation(); setScale(prev => Math.min(prev + 0.1, 2)) }} title="Zoom In">
                    <ZoomIn className="h-4 w-4" />
                </Button>
                <div className="w-full h-px bg-border" />
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent hover:text-accent-foreground" onClick={(e) => { e.stopPropagation(); setScale(prev => Math.max(prev - 0.1, 0.4)) }} title="Zoom Out">
                    <ZoomOut className="h-4 w-4" />
                </Button>
             </div>
             
             {/* Wrapper to force layout size to match visual scale */}
              <div 
                className="relative flex-shrink-0"
                style={{ 
                   width: (orientation === 'portrait' ? 794 : 1123) * scale,
                   height: (orientation === 'portrait' ? 1123 : 794) * scale,
                   marginBottom: '100px',
                }}
              >
                  {/* The Canvas Itself */}
                  <div 
                     ref={canvasRef}
                     onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                     className={`shadow-xl relative flex flex-col ${font} text-zinc-950 bg-white`}
                     style={{ 
                       width: orientation === 'portrait' ? '794px' : '1123px', 
                       minHeight: orientation === 'portrait' ? '1123px' : '794px',
                       backgroundColor: bgColor,
                       transform: `scale(${scale})`,
                       transformOrigin: 'top left',
                       position: 'absolute',
                       top: 0,
                       left: 0,
                       padding: '60px', 
                     }}
                  >

                 {/* Grid Overlay for Alignment */}
                 {showGrid && (
                   <>
                    {/* Horizontal Lines */}
                    <div 
                       className="absolute inset-0 z-0 pointer-events-none opacity-20"
                       style={{
                          backgroundImage: 'linear-gradient(0deg, transparent 23px, #000 24px)',
                          backgroundSize: '100% 20px'
                       }}
                    />
                    {/* Vertical Lines */}
                    <div 
                       className="absolute inset-0 z-0 pointer-events-none opacity-20"
                       style={{
                          backgroundImage: 'linear-gradient(90deg, transparent 23px, #000 24px)',
                          backgroundSize: '20px 100%'
                       }}
                    />
                   </>
                 )}

                 {/* Smart Guides Overlay (Static Elements, Controlled via Ref) */}
                 <div 
                    ref={el => { if(guideLinesRef.current) guideLinesRef.current.vertical = el }}
                    className="absolute bg-orange-500 z-[60] pointer-events-none w-px h-full"
                    style={{ opacity: 0, left: 0, top: 0 }}
                 />
                 <div 
                    ref={el => { if(guideLinesRef.current) guideLinesRef.current.horizontal = el }}
                    className="absolute bg-orange-500 z-[60] pointer-events-none w-full h-px"
                    style={{ opacity: 0, top: 0, left: 0 }}
                 />

                {/* 1. Header Area */}
                <div className="flex justify-between items-start mb-12 relative min-h-[150px] z-10">
                   
                   {/* Block 1: Title & Number */}
                   <div className="space-y-1 w-[300px]">
                      <DraggableBlock 
                         id="header-title"
                         isSelected={selectedId === 'header-title'}
                         onSelect={setSelectedId}
                         currentColor={invoiceData.headerColor}
                         onColorChange={(c) => handleInputChange('headerColor', c)}
                         showGrid={showGrid}
                      >
                         <Input 
                            value={invoiceData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            className={`text-5xl font-bold tracking-tighter border-none hover:bg-slate-50 px-2 h-auto rounded-sm focus-visible:ring-0 ${template === 'bold' ? 'text-blue-600' : 'inherit'}`} 
                         />
                      </DraggableBlock>
                      <DraggableBlock 
                         id="header-number"
                         isSelected={selectedId === 'header-number'}
                         onSelect={setSelectedId}
                         showGrid={showGrid}>
                         <Input 
                            value={invoiceData.number}
                            onChange={(e) => handleInputChange("number", e.target.value)}
                            className="font-medium border-none hover:bg-slate-50 px-2 h-auto w-full focus-visible:ring-0 opacity-75" 
                         />
                      </DraggableBlock>
                   </div>
 
                   {/* Block 2: Company Info */}
                   <div className="text-right space-y-1 w-[300px] flex flex-col items-end">
                      <DraggableBlock 
                         id="company-logo"
                         isSelected={selectedId === 'company-logo'}
                         onSelect={setSelectedId}
                         showGrid={showGrid}>
                         {logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={logo} alt="Logo" className="w-auto object-contain mb-2" style={{ height: logoSize }} />
                         ) : (
                            <div className="h-16 w-32 bg-slate-100 rounded flex items-center justify-center mb-2 text-xs text-slate-400 border border-dashed">No Logo</div>
                         )}
                      </DraggableBlock>
                      <DraggableBlock 
                         id="company-name"
                         isSelected={selectedId === 'company-name'}
                         onSelect={setSelectedId}
                         currentColor={invoiceData.companyColor}
                         onColorChange={(c) => handleInputChange('companyColor', c)}
                         showGrid={showGrid}
                      >
                         <Input 
                            value={invoiceData.companyName}
                            onChange={(e) => handleInputChange("companyName", e.target.value)}
                            className="text-right font-bold text-lg border-none hover:bg-slate-50 px-2 h-auto focus-visible:ring-0" 
                         />
                      </DraggableBlock>
                      <DraggableBlock 
                         id="company-details"
                         isSelected={selectedId === 'company-details'}
                         onSelect={setSelectedId}
                         showGrid={showGrid}
                      >
                         <textarea
                            value={invoiceData.companyDetails}
                            onChange={(e) => handleInputChange("companyDetails", e.target.value)}
                            className="text-right text-sm border-none hover:bg-slate-50 w-full resize-none focus:outline-none bg-transparent px-2 opacity-75"
                            rows={2}
                         />
                      </DraggableBlock>
                   </div>
                </div>
 
                {/* 2. Details Area */}
                <div className="flex justify-between items-start mb-12 relative min-h-[150px]">
                   
                   {/* Block 3: Bill To */}
                   <div className="w-[300px] space-y-1">
                      <DraggableBlock id="bill-to-label" isSelected={selectedId === 'bill-to-label'} onSelect={setSelectedId} currentColor={invoiceData.billToColor} onColorChange={(c) => handleInputChange('billToColor', c)} showGrid={showGrid}>
                        <Input value={invoiceData.billToLabel} onChange={(e) => handleInputChange('billToLabel', e.target.value)} className="text-sm font-semibold mb-1 border-none px-2 h-6 focus-visible:ring-0 opacity-75" />
                      </DraggableBlock>
                      <DraggableBlock id="bill-to-name" isSelected={selectedId === 'bill-to-name'} onSelect={setSelectedId} currentColor={invoiceData.billToColor} onColorChange={(c) => handleInputChange('billToColor', c)} showGrid={showGrid}>
                        <Input value={invoiceData.clientName} onChange={(e) => handleInputChange('clientName', e.target.value)} className="font-bold text-lg border-none px-2 h-8 focus-visible:ring-0" />
                      </DraggableBlock>
                      <DraggableBlock id="bill-to-address" isSelected={selectedId === 'bill-to-address'} onSelect={setSelectedId} currentColor={invoiceData.billToColor} onColorChange={(c) => handleInputChange('billToColor', c)} showGrid={showGrid}>
                        <Input value={invoiceData.clientAddress} onChange={(e) => handleInputChange('clientAddress', e.target.value)} className="text-sm border-none px-2 h-6 focus-visible:ring-0 opacity-80" />
                      </DraggableBlock>
                   </div>
 
                   {/* Block 4: Dates */}
                   <div className="text-right space-y-2 w-[300px] flex flex-col items-end">
                      <DraggableBlock id="date-row" isSelected={selectedId === 'date-row'} onSelect={setSelectedId} currentColor={invoiceData.datesColor} onColorChange={(c) => handleInputChange('datesColor', c)} showGrid={showGrid}>
                        <div className="flex justify-end items-center gap-4">
                           <Input value={invoiceData.dateLabel} onChange={(e) => handleInputChange('dateLabel', e.target.value)} className="text-right w-20 border-none px-2 h-6 focus-visible:ring-0 opacity-75 text-sm shadow-none" />
                           <Input value={invoiceData.dateValue} onChange={(e) => handleInputChange('dateValue', e.target.value)} className="text-right font-medium w-32 border-none px-2 h-6 focus-visible:ring-0 text-sm shadow-none" />
                        </div>
                      </DraggableBlock>
                      <DraggableBlock id="due-row" isSelected={selectedId === 'due-row'} onSelect={setSelectedId} currentColor={invoiceData.datesColor} onColorChange={(c) => handleInputChange('datesColor', c)} showGrid={showGrid}>
                        <div className="flex justify-end items-center gap-4">
                           <Input value={invoiceData.dueLabel} onChange={(e) => handleInputChange('dueLabel', e.target.value)} className="text-right w-20 border-none px-2 h-6 focus-visible:ring-0 opacity-75 text-sm shadow-none" />
                           <Input value={invoiceData.dueValue} onChange={(e) => handleInputChange('dueValue', e.target.value)} className="text-right font-medium w-32 border-none px-2 h-6 focus-visible:ring-0 text-sm shadow-none" />
                        </div>
                      </DraggableBlock>
                   </div>
                </div>

               {/* 3. Items Table */}
               <div className="mb-12">
                  <table className="w-full">
                     <thead>
                        <tr style={{ backgroundColor: tableHeaderBg, color: tableTextColor }} className="transition-colors">
                           <th className="text-left py-3 px-4 rounded-l text-sm">Description</th>
                           <th className="text-right py-3 px-4 text-sm">Amount</th>
                           <th className="w-[40px] rounded-r"></th>
                        </tr>
                     </thead>
                     <tbody>
                        {items.map((item, index) => (
                           <tr key={item.id} className="border-b group hover:bg-slate-50">
                              <td className="py-4 px-4">
                                 <Input 
                                    value={item.desc} 
                                    onChange={(e) => {
                                       const newItems = [...items]; 
                                       newItems[index].desc = e.target.value; 
                                       setItems(newItems)
                                    }} 
                                    className="border-none bg-transparent px-0 h-auto w-full font-medium text-sm" 
                                 />
                              </td>
                              <td className="py-4 px-4 text-right">
                                 <Input 
                                    value={item.amount} 
                                    onChange={(e) => {
                                       const newItems = [...items]; 
                                       newItems[index].amount = e.target.value; 
                                       setItems(newItems)
                                    }} 
                                    className="border-none bg-transparent px-0 h-auto w-full text-right font-medium text-sm" 
                                 />
                              </td>
                              {/* Delete Row Button */}
                              <td className="py-4 px-2 text-center">
                                 <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 opacity-50 hover:opacity-100" onClick={() => setItems(items.filter(i => i.id !== item.id))}>
                                    <Trash2 className="h-4 w-4" />
                                 </Button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
                  <Button 
                     variant="ghost" 
                     className="mt-4 text-blue-600 hover:text-blue-800 hover:bg-blue-50 w-full border border-dashed border-blue-200 text-sm h-10"
                     onClick={() => setItems([...items, { id: Date.now(), desc: "New Item", amount: "Rp 0" }])}
                  >
                     <Plus className="mr-2 h-4 w-4" /> Add Item Row
                  </Button>
               </div>

               {/* 4. Totals */}
               <div className="flex justify-end mb-12">
                  <div className="w-1/2 space-y-3">
                     <DraggableBlock 
                        id="total-row" 
                        isSelected={selectedId === 'total-row'} 
                        onSelect={setSelectedId} 
                        currentColor={invoiceData.totalColor} 
                        onColorChange={(c) => handleInputChange('totalColor', c)} 
                        showGrid={showGrid}
                      >
                        <div className="flex justify-between items-center py-2">
                            <span className="text-xl font-bold">Total</span>
                            <Input 
                              defaultValue="Rp 17.500.000"
                              className="text-right text-2xl font-bold border-none bg-transparent w-48 focus-visible:ring-0 shadow-none px-0"
                            />
                         </div>
                      </DraggableBlock>
                  </div>
               </div>

               {/* 5. Footer / Notes */}
               <div className="mt-auto pt-8 border-t border-slate-100 text-center">
                  <Input 
                     value={invoiceData.notes}
                     onChange={(e) => handleInputChange("notes", e.target.value)}
                     className="text-center text-slate-400 text-sm border-none w-full bg-transparent"
                  />
               </div>

                {/* Custom Draggable Elements */}
                {customElements.map(el => (
                   <div
                      key={el.id}
                      onPointerDown={(e) => {
                           // Don't prevent default if clicking on input - allow text editing
                           if ((e.target as HTMLElement).tagName === 'INPUT') {
                               return;
                           }
                           
                           e.stopPropagation();
                           e.preventDefault(); // Prevent text selection
                           
                           // Select this element
                           setSelectedId(el.id);
                           
                           const element = e.currentTarget as HTMLElement;
                           if (!containerRef.current || !canvasRef.current || !guideLinesRef.current) return;
                           
                           const startX = e.clientX;
                           const startY = e.clientY;
                           const initialX = el.x;
                           const initialY = el.y;
                           const scaleVal = scale || 1; // Capture current scale

                           const onPointerMove = (moveEvent: PointerEvent) => {
                               const deltaX = (moveEvent.clientX - startX) / scaleVal;
                               const deltaY = (moveEvent.clientY - startY) / scaleVal;
                               
                               const currentX = initialX + deltaX;
                               const currentY = initialY + deltaY;
                               
                               // 1. Update Visual Position Immediately (Direct DOM)
                               element.style.transform = `translate(${currentX}px, ${currentY}px)`;
                               
                               // 2. Smart Guides Logic
                               const elRect = element.getBoundingClientRect();
                               
                               const width = elRect.width / scaleVal;
                               const height = elRect.height / scaleVal;
                               
                               const midX = currentX + (width / 2);
                               const midY = currentY + (height / 2);
                               
                               const THRESHOLD = 5; 
                               let showVert = false;
                               let showHorz = false;

                                // Center Line (Page Center)
                               const pageCenterX = (orientation === 'portrait' ? 794 : 1123) / 2;
                               
                               // --- MAGNETIC SNAPPING LOGIC ---
                               let snappedX = currentX;
                               let snappedY = currentY;

                               // 1. Center Snap
                               if (Math.abs(midX - pageCenterX) < THRESHOLD) {
                                   snappedX = pageCenterX - (width / 2); // Snap to exact center
                                   const vGuide = guideLinesRef.current!.vertical;
                                   if (vGuide) {
                                       vGuide.style.left = `${pageCenterX}px`;
                                       vGuide.style.opacity = '1';
                                       showVert = true;
                                   }
                               } else {
                                     // 2. Page Edge Snap (Left/Right)
                                     const canvasW = orientation === 'portrait' ? 794 - 120 : 1123 - 120; // 60px padding * 2
                                     // Snap Left (0)
                                     if (Math.abs(currentX - 0) < THRESHOLD) {
                                         snappedX = 0;
                                         if (guideLinesRef.current!.vertical) {
                                             guideLinesRef.current!.vertical.style.left = `0px`;
                                             guideLinesRef.current!.vertical.style.opacity = '1';
                                         }
                                         showVert = true;
                                     } 
                                     // Snap Right (Canvas Width)
                                     else if (Math.abs((currentX + width) - canvasW) < THRESHOLD) {
                                         snappedX = canvasW - width;
                                         if (guideLinesRef.current!.vertical) {
                                             guideLinesRef.current!.vertical.style.left = `${canvasW}px`;
                                             guideLinesRef.current!.vertical.style.opacity = '1';
                                         }
                                         showVert = true;
                                     }

                                    // 3. Other Elements Snap (Only if no edge snap)
                                    if (!showVert) {
                                        for (const other of customElements) {
                                            if (other.id === el.id) continue;
                                       
                                       // Get other element's dimensions from DOM
                                       const otherEl = document.getElementById(other.id);
                                       if (!otherEl) continue;
                                       
                                       const otherRect = otherEl.getBoundingClientRect();
                                       const otherW = otherRect.width / scaleVal;
                                       const otherH = otherRect.height / scaleVal;
                                       const otherR = other.x + otherW;

                                       // 1. Snap Left to Left (Alignment)
                                       if (Math.abs(currentX - other.x) < THRESHOLD) {
                                           snappedX = other.x;
                                           if (guideLinesRef.current!.vertical) {
                                               guideLinesRef.current!.vertical.style.left = `${other.x}px`;
                                               guideLinesRef.current!.vertical.style.opacity = '1';
                                           }
                                           showVert = true;
                                           break;
                                       }
                                       
                                       // 2. Snap Right to Left (Adjacency: My Right touches Their Left)
                                       // currentRight = currentX + width
                                       if (Math.abs((currentX + width) - other.x) < THRESHOLD) {
                                            snappedX = other.x - width;
                                            if (guideLinesRef.current!.vertical) {
                                                guideLinesRef.current!.vertical.style.left = `${other.x}px`;
                                                guideLinesRef.current!.vertical.style.opacity = '1';
                                            }
                                            showVert = true;
                                            break;
                                       }

                                       // 3. Snap Left to Right (Adjacency: My Left touches Their Right)
                                       if (Math.abs(currentX - otherR) < THRESHOLD) {
                                            snappedX = otherR;
                                            if (guideLinesRef.current!.vertical) {
                                                guideLinesRef.current!.vertical.style.left = `${otherR}px`;
                                                guideLinesRef.current!.vertical.style.opacity = '1';
                                            }
                                            showVert = true;
                                            break;
                                       }
                                   }
                               }
                               }

                               // --- GRID SNAPPING (Optional) ---
                               if (showGrid) {
                                   const GRID_SIZE = 20; // Must match the CSS grid background size
                                   // Snap X
                                   if (Math.abs(currentX % GRID_SIZE) < THRESHOLD) {
                                       snappedX = Math.round(currentX / GRID_SIZE) * GRID_SIZE;
                                   }
                                   // Snap Y
                                   if (Math.abs(currentY % GRID_SIZE) < THRESHOLD) {
                                       snappedY = Math.round(currentY / GRID_SIZE) * GRID_SIZE;
                                   }
                                   // Note: Grid snapping is mutually exclusive or lower priority than magnetic snapping in this simple logic.
                                   // If magnetic snapped, we skip grid snap or let magnetic override.
                               }

                               // 2. Horizontal Snap (Page Edges & Elements)
                               const canvasH = orientation === 'portrait' ? 1123 - 120 : 794 - 120; // 60px padding * 2
                               // Snap Top (0)
                               if (Math.abs(currentY - 0) < THRESHOLD) {
                                   snappedY = 0;
                                   if (guideLinesRef.current!.horizontal) {
                                       guideLinesRef.current!.horizontal.style.top = `0px`;
                                       guideLinesRef.current!.horizontal.style.opacity = '1';
                                   }
                                   showHorz = true;
                               }
                               // Snap Bottom (Canvas Height)
                               else if (Math.abs((currentY + height) - canvasH) < THRESHOLD) {
                                   snappedY = canvasH - height;
                                   if (guideLinesRef.current!.horizontal) {
                                       guideLinesRef.current!.horizontal.style.top = `${canvasH}px`;
                                       guideLinesRef.current!.horizontal.style.opacity = '1';
                                   }
                                   showHorz = true;
                               }

                               if (!showHorz) {
                                   for (const other of customElements) {
                                   if (other.id === el.id) continue;
                                   
                                   // Get other element's dimensions from DOM
                                   const otherEl = document.getElementById(other.id);
                                   if (!otherEl) continue;
                                   
                                   const otherRect = otherEl.getBoundingClientRect();
                                   const otherW = otherRect.width / scaleVal;
                                   const otherH = otherRect.height / scaleVal;
                                   const otherB = other.y + otherH;

                                   // Snap Top to Top (Alignment)
                                   if (Math.abs(currentY - other.y) < THRESHOLD) {
                                       snappedY = other.y;
                                       const hGuide = guideLinesRef.current!.horizontal;
                                       if (hGuide) {
                                           hGuide.style.top = `${other.y}px`;
                                           hGuide.style.opacity = '1';
                                       }
                                       showHorz = true;
                                       break;
                                   }

                                   // Snap Bottom to Top (Adjacency: My Bottom touches Their Top)
                                   // currentBottom = currentY + height
                                   if (Math.abs((currentY + height) - other.y) < THRESHOLD) {
                                        snappedY = other.y - height;
                                        if (guideLinesRef.current!.horizontal) {
                                            guideLinesRef.current!.horizontal.style.top = `${other.y}px`;
                                            guideLinesRef.current!.horizontal.style.opacity = '1';
                                        }
                                        showHorz = true;
                                        break;
                                   }

                                   // Snap Top to Bottom (Adjacency: My Top touches Their Bottom)
                                   if (Math.abs(currentY - otherB) < THRESHOLD) {
                                        snappedY = otherB;
                                        if (guideLinesRef.current!.horizontal) {
                                            guideLinesRef.current!.horizontal.style.top = `${otherB}px`;
                                            guideLinesRef.current!.horizontal.style.opacity = '1';
                                        }
                                        showHorz = true;
                                        break;
                                   }
                               }
                               }

                               const canvasW = orientation === 'portrait' ? 794 - 120 : 1123 - 120; // 60px padding * 2
                               
                               // Clamp X
                               if (snappedX < 0) snappedX = 0;
                               if (snappedX + width > canvasW) snappedX = canvasW - width;
                               
                               // Clamp Y
                               if (snappedY < 0) snappedY = 0;
                               if (snappedY + height > canvasH) snappedY = canvasH - height;

                               // Apply Snapped & Clamped Position immediately
                               element.style.transform = `translate(${snappedX}px, ${snappedY}px)`;
                               element.dataset.lastX = snappedX.toString();
                               element.dataset.lastY = snappedY.toString();

                               if (!showVert && guideLinesRef.current!.vertical) {
                                   guideLinesRef.current!.vertical.style.opacity = '0';
                               }
                                
                                // (Horizontal guide reset moved below loop logic)
                               
                               for (const other of customElements) {
                                   if (other.id === el.id) continue;
                                   if (Math.abs(currentY - other.y) < THRESHOLD) {
                                       const hGuide = guideLinesRef.current!.horizontal;
                                       if (hGuide) {
                                           hGuide.style.top = `${other.y}px`;
                                           hGuide.style.opacity = '1';
                                           showHorz = true;
                                       }
                                       showHorz = true;
                                       break;
                                   }
                               }
                               
                               if (!showHorz && guideLinesRef.current!.horizontal) {
                                   guideLinesRef.current!.horizontal.style.opacity = '0';
                               }
                           };

                           const onPointerUp = (upEvent: PointerEvent) => {
                               window.removeEventListener('pointermove', onPointerMove);
                               window.removeEventListener('pointerup', onPointerUp);
                               
                               // Use dataset for final position to ensure sync with visual snap
                               const finalX = parseFloat(element.dataset.lastX || '0');
                               const finalY = parseFloat(element.dataset.lastY || '0');

                               if (!isNaN(finalX) && !isNaN(finalY)) {
                                   setCustomElements(prev => prev.map(c => c.id === el.id ? { ...c, x: finalX, y: finalY } : c));
                               } else {
                                   const deltaX = (upEvent.clientX - startX) / scaleVal;
                                   const deltaY = (upEvent.clientY - startY) / scaleVal;
                                   setCustomElements(prev => prev.map(c => c.id === el.id ? { ...c, x: initialX + deltaX, y: initialY + deltaY } : c));
                               }
                               
                               if (guideLinesRef.current!.vertical) guideLinesRef.current!.vertical.style.opacity = '0';
                               if (guideLinesRef.current!.horizontal) guideLinesRef.current!.horizontal.style.opacity = '0';
                           };

                           window.addEventListener('pointermove', onPointerMove);
                           window.addEventListener('pointerup', onPointerUp);
                      }}
                      onClick={(e) => {
                         e.stopPropagation()
                         setSelectedId(el.id)
                      }}
                      className={`absolute cursor-move z-10 p-2 rounded transition-none ${selectedId === el.id ? 'border border-blue-500 ring-2 ring-blue-200 z-50' : 'border border-transparent'}`}
                      style={{ transform: `translate(${el.x}px, ${el.y}px)`, position: 'absolute', top: 0, left: 0 }}
                   >
                       {/* Control Cluster (Visible ONLY when Selected) */}
                       {selectedId === el.id && (
                           <>
                           {/* Style Controls (Floating above) */}
                           {el.type === 'text' && (
                           <div className="absolute -top-12 left-0 flex gap-1 z-50 bg-white p-1 rounded-md shadow-sm border border-slate-200">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setCustomElements(prev => prev.map(c => c.id === el.id ? { ...c, fontWeight: c.fontWeight === 'bold' ? 'normal' : 'bold' } : c))
                                        }}
                                        className={`p-1.5 rounded hover:bg-slate-100 ${el.fontWeight === 'bold' ? 'bg-slate-100 text-blue-600' : 'text-slate-600'}`}
                                    >
                                        <LucideIcons.Bold className="w-3 h-3" />
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setCustomElements(prev => prev.map(c => c.id === el.id ? { ...c, fontStyle: c.fontStyle === 'italic' ? 'normal' : 'italic' } : c))
                                        }}
                                        className={`p-1.5 rounded hover:bg-slate-100 ${el.fontStyle === 'italic' ? 'bg-slate-100 text-blue-600' : 'text-slate-600'}`}
                                    >
                                        <LucideIcons.Italic className="w-3 h-3" />
                                    </button>
                                    <div className="w-px h-6 bg-slate-200 mx-0.5" />
                                
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setCustomElements(prev => prev.map(c => c.id === el.id ? { ...c, fontSize: (c.fontSize || 12) - 2 } : c))
                                        }}
                                        className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
                                    >
                                        <LucideIcons.Minus className="w-3 h-3" />
                                    </button>
                                    <span className="text-[10px] text-slate-500 w-4 text-center">{el.fontSize}</span>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setCustomElements(prev => prev.map(c => c.id === el.id ? { ...c, fontSize: (c.fontSize || 12) + 2 } : c))
                                        }}
                                        className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
                                    >
                                        <LucideIcons.Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                           )}
                           
                           <div className="absolute -top-3 -left-3 flex gap-1 z-50">
                             <div className="cursor-move p-1.5 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200 shadow-sm border border-blue-200">
                                <Move className="h-3 w-3" />
                             </div>
                             {/* Delete Button in Control Cluster */}
                             <div 
                                onClick={(e) => {
                                   e.stopPropagation() 
                                   removeCustomElement(el.id)
                                }}
                                className="cursor-pointer p-1.5 bg-white border border-red-200 rounded-full text-red-500 hover:bg-red-50 shadow-sm flex items-center justify-center disable-drag"
                             >
                                <Trash2 className="h-3 w-3" />
                             </div>
                          </div>
                           </>
                       )}
                     {el.type === 'text' ? (
                        <input
                           value={el.content}
                           onChange={(e) => {
                              const updated = customElements.map(c => c.id === el.id ? { ...c, content: e.target.value } : c)
                              setCustomElements(updated)
                           }}
                           className="bg-transparent border-none focus:ring-0 focus:outline-none min-w-[100px]"
                           style={{ 
                               fontSize: el.fontSize,
                               fontWeight: el.fontWeight,
                               fontStyle: el.fontStyle
                           }}
                        />
                     ) : (
                        <RenderIcon name={el.content} size={el.fontSize} />
                     )}
                  </div>
               ))}

               {/* Watermark Overlay */}
               {showStamp && (
                  <div 
                     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 pointer-events-none border-[12px] font-black p-4 z-0 select-none whitespace-nowrap opacity-20"
                     style={{ 
                        color: stampColor,
                        borderColor: stampColor,
                        fontSize: stampSize,
                        borderRadius: 20
                     }}
                  >
                     {stampText}
                  </div>
               )}

            </div>
        </div>
      </div>
       </div>
          
      {/* === MOBILE TOOLBAR (Floating Bottom Pill - Figma Style) === */}
      <div className="lg:hidden fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-center">
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md shadow-2xl rounded-full px-4 py-2 border border-slate-200/60 ring-1 ring-slate-900/5">
                {/* 1. Design */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-10 w-10 full rounded-full hover:bg-slate-100 ${activePopover === 'design' ? 'bg-slate-100' : ''}`} 
                    onClick={() => togglePopover('design')}
                    title="Tampilan"
                >
                    <Palette className="h-5 w-5 text-slate-700" />
                </Button>

                <Separator orientation="vertical" className="h-6 opacity-30 mx-1" />

                {/* 2. Add Text Direct */}
                <Button variant="ghost" size="icon" className="h-10 w-10 full rounded-full hover:bg-slate-100" onClick={addTextElement} title="Tambah Teks">
                    <Type className="h-5 w-5 text-slate-700" />
                </Button>

                {/* 3. Upload Logo Direct */}
                <Button variant="ghost" size="icon" className="h-10 w-10 full rounded-full hover:bg-slate-100" onClick={() => fileInputRef.current?.click()} title="Upload Logo">
                    <ImageIcon className="h-5 w-5 text-slate-700" />
                    <Input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </Button>

                {/* 4. More Elements */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-10 w-10 full rounded-full hover:bg-slate-100 ${activePopover === 'elements' ? 'bg-slate-100' : ''}`} 
                    onClick={() => togglePopover('elements')}
                    title="Stiker & Ikon"
                >
                    <Grid3X3 className="h-5 w-5 text-slate-700" />
                </Button>

                <Separator orientation="vertical" className="h-6 opacity-30 mx-1" />

                {/* 5. Settings */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-10 w-10 full rounded-full hover:bg-slate-100 ${activePopover === 'settings' ? 'bg-slate-100' : ''}`} 
                    onClick={() => togglePopover('settings')}
                    title="Pengaturan"
                >
                    <Settings className="h-5 w-5 text-slate-700" />
                </Button>
            </div>
      </div>

       {/* === Manual Mobile Popovers === */}
       {activePopover === 'design' && (
        <div className="lg:hidden fixed bottom-45 left-1/2 -translate-x-1/2 w-[320px] bg-popover text-popover-foreground rounded-xl shadow-2xl border border-border p-4 z-[200]">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
               <h4 className="font-semibold text-sm">Tampilan & Tema</h4>
               <button onClick={() => setActivePopover(null)} className="text-muted-foreground hover:text-foreground text-2xl leading-none">&times;</button>
            </div>
            <AppearanceControls 
                template={template} setTemplate={setTemplate}
                font={font} setFont={setFont}
                tableHeaderBg={tableHeaderBg} setTableHeaderBg={setTableHeaderBg}
                tableTextColor={tableTextColor} setTableTextColor={setTableTextColor}
            />
        </div>
       )}

       {activePopover === 'elements' && (
        <div className="lg:hidden fixed bottom-45 left-1/2 -translate-x-1/2 w-[320px] bg-popover text-popover-foreground rounded-xl shadow-2xl border border-border p-4 z-[200]">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
               <h4 className="font-semibold text-sm">Element Tambahan</h4>
               <button onClick={() => setActivePopover(null)} className="text-muted-foreground hover:text-foreground text-2xl leading-none">&times;</button>
            </div>
            <ElementsControls 
                addCustomIcon={addCustomIcon}
                addTextElement={addTextElement}
                fileInputRef={fileInputRef}
                handleLogoUpload={handleLogoUpload}
                logoSize={logoSize}
                setLogoSize={setLogoSize}
            />
        </div>
       )}

       {activePopover === 'settings' && (
        <div className="lg:hidden fixed bottom-45 left-1/2 -translate-x-1/2 w-[320px] bg-popover text-popover-foreground rounded-xl shadow-2xl border border-border p-4 z-[200]">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
               <h4 className="font-semibold text-sm">Pengaturan Kertas</h4>
               <button onClick={() => setActivePopover(null)} className="text-muted-foreground hover:text-foreground text-2xl leading-none">&times;</button>
            </div>
            <SettingsControls 
                showGrid={showGrid} setShowGrid={setShowGrid}
                orientation={orientation} setOrientation={setOrientation}
                bgColor={bgColor} setBgColor={setBgColor}
                showStamp={showStamp} setShowStamp={setShowStamp}
                stampText={stampText} setStampText={setStampText}
                stampColor={stampColor} setStampColor={setStampColor}
                stampSize={stampSize} setStampSize={setStampSize}
            />
        </div>
       )}
    </div>
  )
}

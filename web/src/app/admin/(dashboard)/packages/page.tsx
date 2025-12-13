"use client"

import { useState } from "react"
import { 
  Package, 
  Plus, 
  Settings2, 
  MoreVertical, 
  Trash2, 
  Check,
  Tag,
  ChevronDown,
  ChevronUp
} from "lucide-react"

import { cn } from "@/lib/utils"

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

// Types
interface Category {
  id: string
  name: string
  description?: string
  totalPackages: number
}

interface ProductPackage {
  id: string
  categoryId: string
  name: string
  price: string
  description: string
  features: string[]
}

// Initial Data
const initialCategories: Category[] = [
  { id: "cat-1", name: "Wedding", description: "Paket pernikahan lengkap", totalPackages: 3 },
  { id: "cat-2", name: "Pre-Wedding", description: "Sesi foto sebelum nikah", totalPackages: 2 },
  { id: "cat-3", name: "Graduation", description: "Wisuda & Kelulusan", totalPackages: 2 },
  { id: "cat-4", name: "Family", description: "Foto keluarga studio/outdoor", totalPackages: 1 },
]

const initialPackages: ProductPackage[] = [
  { 
    id: "pkg-1", 
    categoryId: "cat-1", 
    name: "Wedding Silver", 
    price: "Rp 5.000.000", 
    description: "Paket hemat untuk acara intimate.",
    features: ["4 Jam Dokumentasi", "1 Fotografer", "50 Edited Photos", "Flashdisk"]
  },
  { 
    id: "pkg-2", 
    categoryId: "cat-1", 
    name: "Wedding Gold", 
    price: "Rp 8.000.000", 
    description: "Pilihan favorit untuk resepsi gedung.",
    features: ["8 Jam Dokumentasi", "2 Fotografer", "100 Edited Photos", "Cetak Album Magazine", "Flashdisk"]
  },
  { 
    id: "pkg-3", 
    categoryId: "cat-1", 
    name: "Wedding Platinum", 
    price: "Rp 15.000.000", 
    description: "Paket lengkap dokumentasi cinematic.",
    features: ["Full Day Coverage", "2 Fotografer & 1 Videografer", "Same Day Edit Video", "Album Premium Box", "Canvas Print 60x40"]
  },
  { 
    id: "pkg-4", 
    categoryId: "cat-3", 
    name: "Graduation Single", 
    price: "Rp 350.000", 
    description: "Foto wisuda personal di studio.",
    features: ["1 Jam Sesi", "3 Background", "5 Edited Photos", "Cetak 10R"]
  },
]

export default function PackagesPage() {
  // State
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [packages, setPackages] = useState<ProductPackage[]>(initialPackages)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialCategories[0].id)
  
  // Mobile Collapsible State
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)

  // Dialog States
  const [isCatDialogOpen, setIsCatDialogOpen] = useState(false)
  const [isPkgDialogOpen, setIsPkgDialogOpen] = useState(false)
  
  // Form States
  const [catForm, setCatForm] = useState({ name: "", description: "" })
  const [pkgForm, setPkgForm] = useState({ name: "", price: "", description: "", featuresString: "" }) // Features as comma separated string for simple input

  // Derived State
  const selectedCategory = categories.find(c => c.id === selectedCategoryId)
  const categoryPackages = packages.filter(p => p.categoryId === selectedCategoryId)

  // Handlers - Category
  const handleAddCategory = () => {
    const newId = `cat-${Date.now()}`
    setCategories([...categories, { ...catForm, id: newId, totalPackages: 0 }])
    setCatForm({ name: "", description: "" })
    setIsCatDialogOpen(false)
    setSelectedCategoryId(newId) // Select the new category
  }

  const handleDeleteCategory = (id: string) => {
    // Prevent delete if only 1 category exists
    if (categories.length <= 1) return alert("Minimal harus ada 1 kategori.")
    
    setCategories(categories.filter(c => c.id !== id))
    setPackages(packages.filter(p => p.categoryId !== id)) // Cascade delete packages
    if (selectedCategoryId === id) {
      setSelectedCategoryId(categories.find(c => c.id !== id)?.id || "")
    }
  }

  // Handlers - Package
  const handleAddPackage = () => {
    const newId = `pkg-${Date.now()}`
    const features = pkgForm.featuresString.split(",").map(f => f.trim()).filter(f => f !== "")
    setPackages([...packages, { 
      id: newId, 
      categoryId: selectedCategoryId, 
      name: pkgForm.name, 
      price: pkgForm.price, 
      description: pkgForm.description, 
      features 
    }])
    setPkgForm({ name: "", price: "", description: "", featuresString: "" })
    setIsPkgDialogOpen(false)
    
    // Update count
    setCategories(categories.map(c => c.id === selectedCategoryId ? { ...c, totalPackages: c.totalPackages + 1 } : c))
  }

  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter(p => p.id !== id))
    // Update count
    setCategories(categories.map(c => c.id === selectedCategoryId ? { ...c, totalPackages: Math.max(0, c.totalPackages - 1) } : c))
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Kategori & Paket</h2>
          <p className="text-xs md:text-sm text-muted-foreground">Atur jenis layanan dan detail harga.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 h-auto md:h-[calc(100vh-200px)]">
        
        {/* Left Sidebar: Categories - Collapsible on Mobile */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-4">
          <Card className={`flex flex-col ${isCategoryOpen ? 'h-auto' : 'h-auto md:h-full'}`}>
            <CardHeader className="pb-3 border-b p-3 md:p-6 cursor-pointer md:cursor-default bg-muted/20 md:bg-transparent" onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-base md:text-lg">Kategori</CardTitle>
                    {/* Selected category badge on mobile when collapsed */}
                    {!isCategoryOpen && (
                        <div className="md:hidden">
                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal">
                                {selectedCategory?.name}
                            </Badge>
                        </div>
                    )}
                </div>
                
                <div className="flex items-center gap-2">
                    {/* Toggle Icon Mobile */}
                    <div className="md:hidden text-muted-foreground">
                        {isCategoryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>

                    <Dialog open={isCatDialogOpen} onOpenChange={setIsCatDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Plus className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle>Buat Kategori Baru</DialogTitle>
                            <DialogDescription>Misal: Wedding, Wisuda, Studio.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Nama Kategori</Label>
                                <Input 
                                value={catForm.name} 
                                onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} 
                                placeholder="Contoh: Wedding" 
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Deskripsi Singkat</Label>
                                <Textarea 
                                value={catForm.description} 
                                onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} 
                                placeholder="Opsional..." 
                                />
                            </div>
                            </div>
                            <DialogFooter>
                            <Button onClick={(e) => { e.stopPropagation(); handleAddCategory(); }}>Buat Kategori</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
              </div>
            </CardHeader>
            
            {/* Scroll Area - Hidden on mobile if closed */}
            <div className={cn("md:flex-1 md:flex flex-col transition-all duration-300 ease-in-out", isCategoryOpen ? "max-h-[300px] overflow-hidden flex" : "hidden max-h-0 md:max-h-none")}>
                <ScrollArea className="flex-1 md:max-h-none h-[300px] md:h-auto">
                <div className="p-2 space-y-1">
                    {categories.map(category => (
                    <div
                        key={category.id}
                        role="button"
                        tabIndex={0}
                        className={cn(
                        "w-full justify-start h-auto py-2.5 px-3 md:py-3 md:px-4 relative group cursor-pointer rounded-md transition-colors",
                        selectedCategoryId === category.id 
                            ? "bg-primary/10 text-primary hover:bg-primary/15" 
                            : "hover:bg-muted"
                        )}
                        onClick={() => {
                            setSelectedCategoryId(category.id);
                            setIsCategoryOpen(false); // Auto close on mobile selection
                        }}
                    >
                        <div className="flex flex-col items-start gap-0.5 md:gap-1 w-full text-left">
                        <div className="flex items-center justify-between w-full">
                            <span className="font-semibold text-sm">{category.name}</span>
                            {selectedCategoryId === category.id && <Check className="h-3 w-3 text-primary" />}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center justify-between w-full">
                            <span className="truncate max-w-[120px] opacity-80">{category.description || "Tanpa deskripsi"}</span>
                            <span className="bg-background/50 border px-1.5 py-0.5 rounded-full text-[10px] font-medium min-w-[max-content]">
                                {category.totalPackages} Pkt
                            </span>
                        </div>
                        </div>
                        {/* Hover Actions for Category */}
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 rounded-md">
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500 hover:text-red-700" onClick={(e) => { e.stopPropagation(); handleDeleteCategory(category.id); }}>
                            <Trash2 className="h-3 w-3" />
                        </Button>
                        </div>
                    </div>
                    ))}
                </div>
                </ScrollArea>
            </div>
          </Card>
        </div>

        {/* Right Content: Packages */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-4">
           {selectedCategory ? (
             <div className="space-y-4 h-full flex flex-col">
               <div className="flex flex-col md:flex-row md:items-center justify-between bg-card p-3 md:p-4 rounded-xl border shadow-sm gap-3">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
                      <Tag className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      Paket {selectedCategory.name}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{selectedCategory.description}</p>
                  </div>
                  <Dialog open={isPkgDialogOpen} onOpenChange={setIsPkgDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="w-full md:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> Tambah Paket
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                         <DialogTitle>Buat Paket Baru di {selectedCategory.name}</DialogTitle>
                         <DialogDescription>Isi detail paket seperti Harga dan Fitur.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="grid gap-2">
                              <Label>Nama Paket</Label>
                              <Input placeholder="Misal: Silver, Gold" value={pkgForm.name} onChange={(e) => setPkgForm({...pkgForm, name: e.target.value})} />
                           </div>
                           <div className="grid gap-2">
                              <Label>Harga (Rp)</Label>
                              <Input placeholder="5.000.000" value={pkgForm.price} onChange={(e) => setPkgForm({...pkgForm, price: e.target.value})} />
                           </div>
                        </div>
                        <div className="grid gap-2">
                           <Label>Deskripsi</Label>
                           <Textarea placeholder="Keterangan singkat..." value={pkgForm.description} onChange={(e) => setPkgForm({...pkgForm, description: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                           <Label>Fitur (Pisahkan dengan koma)</Label>
                           <Textarea 
                            placeholder="4 Jam, 1 Fotografer, 50 Edit..." 
                            value={pkgForm.featuresString} 
                            onChange={(e) => setPkgForm({...pkgForm, featuresString: e.target.value})} 
                            className="h-24 font-mono text-sm"
                           />
                           <p className="text-[10px] text-muted-foreground">Setiap fitur yang dipisahkan koma akan menjadi poin checklist.</p>
                        </div>
                      </div>
                      <DialogFooter>
                         <Button onClick={handleAddPackage}>Simpan Paket</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
               </div>

               {/* Packages Grid */}
               <ScrollArea className="flex-1">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20 md:pb-0">
                    {categoryPackages.length === 0 ? (
                        <div className="col-span-full h-40 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl">
                            <Package className="h-8 w-8 mb-2 opacity-50" />
                            <p>Belum ada paket di kategori ini.</p>
                        </div>
                    ) : (
                        categoryPackages.map(pkg => (
                            <Card key={pkg.id} className="flex flex-col relative group">
                                <CardHeader className="pb-2 p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-base font-bold">{pkg.name}</CardTitle>
                                            <CardDescription className="text-primary font-bold mt-1 text-sm">{pkg.price}</CardDescription>
                                        </div>
                                        <div className="absolute top-2 right-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem className="text-red-500" onClick={() => handleDeletePackage(pkg.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2 min-h-[2.5em]">{pkg.description}</p>
                                </CardHeader>
                                <CardContent className="flex-1 p-4 pt-0">
                                    <div className="space-y-1.5 mt-2">
                                        {pkg.features.slice(0, 4).map((feat, i) => (
                                            <div key={i} className="flex items-start gap-2 text-xs">
                                                <Check className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                                                <span className="opacity-90">{feat}</span>
                                            </div>
                                        ))}
                                        {pkg.features.length > 4 && (
                                            <p className="text-[10px] text-muted-foreground pl-5 italic">+{pkg.features.length - 4} fitur lainnya</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                 </div>
               </ScrollArea>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                <Settings2 className="h-12 w-12 mb-4" />
                <p>Pilih kategori di sidebar untuk melihat paket.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}

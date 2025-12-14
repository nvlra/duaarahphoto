
"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Trash2, Video, FolderPlus, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  Card,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { supabase } from "@/lib/supabaseClient"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { useToast } from "@/components/ui/ios-toast"

// Types
interface Photo {
  id: string
  type: 'image' | 'video'
  url: string
  categoryId?: string
  categoryName?: string // For display
  section: 'landing' | 'category'
  displayDate: string
}

interface Category {
  id: string
  name: string
}

interface GalleryItemDB {
  id: string
  created_at: string
  url: string
  type: "image" | "video"
  category_id: string
  gallery_categories: { name: string } | null
  section: "landing" | "category"
  display_date: string
}

export default function ManageGallery() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  
  const [activeTab, setActiveTab] = useState("landing")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")
  
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [itemType, setItemType] = useState<"image" | "video">("image")
  const [url, setUrl] = useState("")
  const [newCatName, setNewCatName] = useState("")

  const [isCatDialogOpen, setIsCatDialogOpen] = useState(false) // For adding category

  const toast = useToast()
  // Confirm Modal State
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<() => Promise<void> | void>(() => {})
  const [confirmTitle, setConfirmTitle] = useState("")
  const [confirmDescription, setConfirmDescription] = useState("")

  const fetchData = useCallback(async () => {
    try {
        const { data: cats } = await supabase.from('gallery_categories').select('*').order('name', { ascending: true })
        const { data: items } = await supabase.from('gallery_items').select('*, gallery_categories(name)').order('created_at', { ascending: false })

        if (cats) {
            setCategories(cats)
            // moved selection logic to separate effect
        }

        if (items) {
            // Cast strictly
            const dbItems = items as unknown as GalleryItemDB[]
            setPhotos(dbItems.map((i) => ({
                id: i.id,
                type: i.type,
                url: i.url,
                categoryId: i.category_id,
                categoryName: i.gallery_categories?.name,
                section: i.section,
                displayDate: i.display_date 
            })))
        }
    } catch (error) {
        console.error("Error fetching gallery:", error)
        toast.error("Gagal memuat galeri")
    }
  }, [toast])

  // Initial Fetch
  useEffect(() => {
    // eslint-disable-next-line
    fetchData()
  }, [fetchData])

  // Select default category
  useEffect(() => {
      if (categories.length > 0 && !selectedCategoryId) {
          // eslint-disable-next-line
          setSelectedCategoryId(categories[0].id)
      }
  }, [categories, selectedCategoryId])

  // Handlers
  const handleDelete = (id: string) => {
    setConfirmTitle("Hapus Item")
    setConfirmDescription("Apakah anda yakin ingin menghapus item galeri ini?")
    setConfirmAction(() => async () => {
        const { error } = await supabase.from('gallery_items').delete().eq('id', id)
        if (!error) {
            toast.success("Berhasil dihapus")
            fetchData()
        } else {
            toast.error("Gagal menghapus: " + error.message)
        }
    })
    setConfirmOpen(true)
  }

  const handleAddCategory = async () => {
    if (!newCatName) return
    const { error } = await supabase.from('gallery_categories').insert({ name: newCatName })
    if (!error) {
        toast.success("Kategori dibuat")
        setNewCatName("")
        setIsCatDialogOpen(false)
        fetchData()
    } else {
        toast.error("Gagal membuat kategori: " + error.message)
    }
  }

  const handleAddItem = async () => {
      if (!url) return
      
      const payload = {
          type: itemType,
          url: url,
          section: activeTab === 'landing' ? 'landing' : 'category',
          category_id: activeTab === 'categories' ? selectedCategoryId : null
      }

      const { error } = await supabase.from('gallery_items').insert(payload)
      
      if (!error) {
          toast.success("Foto/Video ditambahkan")
          setIsAddOpen(false)
          setUrl("")
          fetchData()
      } else {
          toast.error("Gagal menambahkan: " + error.message)
      }
  }
  
  // Filter logic
  const displayedPhotos = activeTab === "landing"
    ? photos.filter(p => p.section === "landing")
    : photos.filter(p => p.section === "category" && p.categoryId === selectedCategoryId)

  const limitReached = displayedPhotos.length >= 20 // Increased limit

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Galeri</h2>
          <p className="text-xs md:text-sm text-muted-foreground">Kelola konten visual website.</p>
        </div>
      </div>

      <Tabs defaultValue="landing" onValueChange={setActiveTab} className="w-full">
        {/* Mobile: Stack controls */}
        <div className="flex flex-col gap-3 mb-4 sticky top-14 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 pt-2 pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:static md:bg-transparent md:z-auto md:p-0">
           <TabsList className="w-full grid grid-cols-2 h-auto p-1">
            <TabsTrigger value="landing" className="text-xs md:text-sm py-2">Landing Page</TabsTrigger>
            <TabsTrigger value="categories" className="text-xs md:text-sm py-2">Kategori</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2 items-center">
            {activeTab === "categories" && (
                <div className="flex-1 flex gap-2">
                    <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                    <SelectTrigger className="flex-1 h-9 text-xs md:text-sm">
                        <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <Dialog open={isCatDialogOpen} onOpenChange={setIsCatDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" title="Tambah Kategori">
                                <FolderPlus className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Buat Kategori Baru</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                <Label>Nama Kategori</Label>
                                <Input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Misal: Wedding" />
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddCategory}>Simpan</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
             {/* If not in categories, we need a spacer or nothing, 
                 but we always need the Add Button to be accessible or aligned */}
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className={`h-9 text-xs md:text-sm ${activeTab !== 'categories' ? 'w-full md:w-auto' : ''}`}>
                  <Plus className="mr-2 h-4 w-4" /> Tambah
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Konten Baru</DialogTitle>
                  <DialogDescription>
                    Masukkan URL foto atau video embed.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center gap-4">
                     <Button 
                        variant={itemType === "image" ? "default" : "outline"} 
                        onClick={() => setItemType("image")}
                        className="flex-1"
                     >
                        URL Foto
                     </Button>
                     <Button 
                        variant={itemType === "video" ? "default" : "outline"} 
                        onClick={() => setItemType("video")}
                        className="flex-1"
                     >
                        Embed Video
                     </Button>
                  </div>
                  
                  {itemType === "image" ? (
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="picture">URL Foto</Label>
                      <Input id="picture" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
                      <p className="text-xs text-muted-foreground">Masukkan URL gambar langsung.</p>
                    </div>
                  ) : (
                    <div className="grid w-full items-center gap-1.5">
                       <Label htmlFor="videoLink">Link Embed Video</Label>
                       <Input id="videoLink" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." />
                       <p className="text-xs text-muted-foreground">Support link Google Drive atau YouTube Embed.</p>
                    </div>
                  )}

                  {activeTab === "categories" && (
                     <div className="grid w-full items-center gap-1.5">
                        <Label>Kategori Target</Label>
                        <Input value={categories.find(c => c.id === selectedCategoryId)?.name || ""} disabled />
                     </div>
                  )}
                </div>
                <DialogFooter>
                  <Button onClick={handleAddItem}>Simpan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {activeTab === "categories" && limitReached && (
           <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 rounded-r-md">
              <div className="flex">
                 <div className="shrink-0">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                 </div>
                 <div className="ml-3">
                    <p className="text-xs md:text-sm text-yellow-700">
                       <span className="font-medium">Perhatian:</span> Kategori ini sudah mencapai batas 20 item.
                    </p>
                 </div>
              </div>
           </div>
        )}

        <TabsContent value="landing" className="mt-0">
           <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {displayedPhotos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden group relative aspect-4/5 bg-muted">
                    {photo.type === 'image' ? (
                       <Image src={photo.url} alt="Gallery" fill className="object-cover transition-transform group-hover:scale-105" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center bg-black/10">
                           <Video className="h-8 w-8 text-white drop-shadow-md" />
                           <iframe src={photo.url} className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" />
                       </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(photo.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    {activeTab === 'landing' && photo.categoryName && (
                        <div className="absolute bottom-2 left-2 right-2">
                            <span className="bg-black/60 text-white text-[10px] px-2 py-1 rounded-full truncate block w-max max-w-full">
                                {photo.categoryName}
                            </span>
                        </div>
                    )}
                </Card>
              ))}
               
               {/* Add New Placeholder Card */}
               <Card 
                  className="aspect-4/5 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setIsAddOpen(true)}
               >
                   <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                   <span className="text-xs text-muted-foreground font-medium">Tambah Item</span>
               </Card>
           </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-0">
            <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {displayedPhotos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden group relative aspect-4/5 bg-muted">
                    {photo.type === 'image' ? (
                       <Image src={photo.url} alt="Gallery" fill className="object-cover transition-transform group-hover:scale-105" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center bg-black/10">
                           <Video className="h-8 w-8 text-white drop-shadow-md" />
                           <iframe src={photo.url} className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" />
                       </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                         <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(photo.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </Card>
              ))}
               <Card 
                  className="aspect-4/5 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setIsAddOpen(true)}
               >
                   <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                   <span className="text-xs text-muted-foreground font-medium">Tambah ke Kategori</span>
               </Card>
            </div>
        </TabsContent>
      </Tabs>
      
      {/* Hidden Alert Dialog Logic if needed, but we used window.confirm for simplicity */}
      
      <ConfirmModal 
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmAction}
        title={confirmTitle}
        description={confirmDescription}
        confirmText="Hapus"
        variant="destructive"
      />
    </div>
  )
}


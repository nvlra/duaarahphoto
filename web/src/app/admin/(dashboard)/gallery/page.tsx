"use client"

import { useState } from "react"
import { Plus, Trash2, Video, FolderPlus, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardFooter,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mock data
const initialPhotos = [
  { id: 1, type: 'image', url: "https://images.unsplash.com/photo-1511285560982-1356c11d4606?q=80&w=2076&auto=format&fit=crop", category: "Wedding", section: "category", date: "2025-01-15" },
  { id: 2, type: 'image', url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop", category: "Wedding", section: "category", date: "2025-02-01" },
  { id: 3, type: 'image', url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop", category: "Portrait", section: "category", date: "2025-03-10" },
  { id: 4, type: 'image', url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop", category: "General", section: "landing", date: "2025-03-12" }, // Landing Page photo
  { id: 5, type: 'video', url: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "Wedding", section: "category", date: "2025-03-15" },
]

const initialCategories = ["Wedding", "Portrait", "Event", "Family"]

type Photo = {
  id: number;
  type: string;
  url: string;
  category: string;
  section: string;
  date: string;
}

export default function ManageGallery() {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos)
  const [categories] = useState(initialCategories) 
  const [activeTab, setActiveTab] = useState("landing")
  const [selectedCategory, setSelectedCategory] = useState("Wedding")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newItemType, setNewItemType] = useState("image")

  // Mock upload handlers
  const handleDelete = (id: number) => {
    setPhotos(photos.filter(p => p.id !== id))
  }

  const handleAddCategory = () => {
    // Logic to add category
    alert("Fitur tambah kategori akan diimplementasikan dengan backend.")
  }

  // Filter logic
  const displayedPhotos = activeTab === "landing"
    ? photos.filter(p => p.section === "landing")
    : photos.filter(p => p.section === "category" && p.category === selectedCategory)

  const limitReached = displayedPhotos.length >= 10

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
        <div className="flex flex-col gap-3 mb-4 sticky top-14 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-2 pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:static md:bg-transparent md:z-auto md:p-0"> sticky top-14 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-2 pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:static md:bg-transparent md:z-auto md:p-0">
           <TabsList className="w-full grid grid-cols-2 h-auto p-1">
            <TabsTrigger value="landing" className="text-xs md:text-sm py-2">Landing Page</TabsTrigger>
            <TabsTrigger value="categories" className="text-xs md:text-sm py-2">Kategori</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2 items-center">
            {activeTab === "categories" && (
                <div className="flex-1 flex gap-2">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="flex-1 h-9 text-xs md:text-sm">
                        <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={handleAddCategory} title="Kelola Kategori">
                        <FolderPlus className="h-4 w-4" />
                    </Button>
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
                    Upload foto atau masukkan link video embed.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center gap-4">
                     <Button 
                        variant={newItemType === "image" ? "default" : "outline"} 
                        onClick={() => setNewItemType("image")}
                        className="flex-1"
                     >
                        Upload Foto
                     </Button>
                     <Button 
                        variant={newItemType === "video" ? "default" : "outline"} 
                        onClick={() => setNewItemType("video")}
                        className="flex-1"
                     >
                        Embed Video
                     </Button>
                  </div>
                  
                  {newItemType === "image" ? (
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="picture">File Foto</Label>
                      <Input id="picture" type="file" />
                      <p className="text-xs text-muted-foreground">Maksimal 5MB. Format JPG/PNG.</p>
                    </div>
                  ) : (
                    <div className="grid w-full items-center gap-1.5">
                       <Label htmlFor="videoLink">Link Embed Video</Label>
                       <Input id="videoLink" placeholder="https://drive.google.com/..." />
                       <p className="text-xs text-muted-foreground">Support link Google Drive atau YouTube Embed.</p>
                    </div>
                  )}

                  {activeTab === "categories" && (
                     <div className="grid w-full items-center gap-1.5">
                        <Label>Kategori Target</Label>
                        <Input value={selectedCategory} disabled />
                     </div>
                  )}
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsAddOpen(false)}>Simpan</Button>
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
                       <span className="font-medium">Perhatian:</span> Kategori ini sudah mencapai batas 10 item.
                    </p>
                 </div>
              </div>
           </div>
        )}

        <TabsContent value="landing" className="mt-0">
           <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {displayedPhotos.map((photo) => (
                 <GalleryItem key={photo.id} photo={photo} onDelete={handleDelete} />
              ))}
           </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-0">
           <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {displayedPhotos.map((photo) => (
                 <GalleryItem key={photo.id} photo={photo} onDelete={handleDelete} />
              ))}
           </div>
           {displayedPhotos.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                 <p className="text-muted-foreground text-sm">Belum ada foto di kategori ini.</p>
              </div>
           )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function GalleryItem({ photo, onDelete }: { photo: Photo, onDelete: (id: number) => void }) {
   return (
      <Card className="overflow-hidden group relative border shadow-sm">
         <div className="aspect-square md:aspect-auto md:min-h-[200px] bg-muted relative overflow-hidden">
            {photo.type === 'video' ? (
               <div className="w-full h-full flex items-center justify-center bg-zinc-900 border-0">
                  <Video className="h-8 w-8 text-zinc-500" />
                  <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">VIDEO</span>
               </div>
            ) : (
               // eslint-disable-next-line @next/next/no-img-element
               <img 
               src={photo.url} 
               alt="Gallery Item" 
               className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
               />
            )}
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
               <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button variant="destructive" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                     <AlertDialogHeader>
                        <AlertDialogTitle>Hapus item ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                           File akan dihapus permanen.
                        </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(photo.id)} className="bg-red-600 hover:bg-red-700">
                           Hapus
                        </AlertDialogAction>
                     </AlertDialogFooter>
                  </AlertDialogContent>
               </AlertDialog>
            </div>
         </div>
         <CardFooter className="p-2 text-[10px] md:text-xs text-muted-foreground justify-between bg-white dark:bg-zinc-950">
            <span className="font-medium truncate max-w-[80px] md:max-w-[100px]">{photo.category}</span>
            <span>{photo.date}</span>
         </CardFooter>
      </Card>
   )
}

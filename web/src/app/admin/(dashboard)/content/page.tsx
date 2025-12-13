"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"

export default function ManageContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Konten</h2>
        <p className="text-muted-foreground">Update konten untuk halaman publik Anda.</p>
      </div>

      <Tabs defaultValue="about">
        <TabsList>
          <TabsTrigger value="about">Halaman Tentang</TabsTrigger>
          <TabsTrigger value="contact">Info Kontak</TabsTrigger>
          <TabsTrigger value="seo">Pengaturan SEO</TabsTrigger>
        </TabsList>

        {/* About Page Content */}
        <TabsContent value="about" className="space-y-4 mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-4 data-[state=active]:duration-500 ease-in-out">
          <Card>
            <CardHeader>
              <CardTitle>Bagian About Us</CardTitle>
              <CardDescription>
                Sesuaikan cerita dan visi yang ditampilkan di halaman Tentang.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="headline">Judul Utama</Label>
                <Input id="headline" defaultValue="Capturing Moments, Creating Memories" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Biografi Fotografer</Label>
                <Textarea 
                  id="bio" 
                  className="min-h-[150px]"
                  defaultValue="Halo, saya fotografer utama di Enviel..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vision">Visi Kami</Label>
                <Textarea 
                  id="vision" 
                  className="min-h-[100px]"
                  defaultValue="Kami percaya setiap foto menceritakan kisah unik..."
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Contact Page Content */}
        <TabsContent value="contact" className="space-y-4 mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-4 data-[state=active]:duration-500 ease-in-out">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kontak</CardTitle>
              <CardDescription>
                Update bagaimana klien dapat menghubungi Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Bisnis</Label>
                <Input id="email" type="email" defaultValue="hello@duaaraphoto.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telepon / WhatsApp</Label>
                <Input id="phone" defaultValue="+62 812-3456-7890" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Alamat Digital / Lokasi</Label>
                <Input id="address" defaultValue="Jakarta, Indonesia" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ig">Username Instagram</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">@</span>
                  <Input id="ig" defaultValue="envielphoto" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* SEO Content */}
        <TabsContent value="seo" className="space-y-4 mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-4 data-[state=active]:duration-500 ease-in-out">
          <Card>
             <CardHeader>
              <CardTitle>Global SEO</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Meta Title</Label>
                  <Input defaultValue="Enviel Photography - Wedding & Events" />
                </div>
                <div className="grid gap-2">
                  <Label>Meta Description</Label>
                  <Textarea defaultValue="Professional photography services in Jakarta..." />
                </div>
             </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

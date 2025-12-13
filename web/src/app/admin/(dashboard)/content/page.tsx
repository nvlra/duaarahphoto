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

import { supabase } from "@/lib/supabaseClient"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function ManageContent() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
      about_headline: "",
      about_bio: "",
      about_vision: "",
      contact_email: "",
      contact_phone: "",
      contact_address: "",
      social_instagram: ""
      // seo fields if needed
  })

  const fetchSettings = async () => {
      setLoading(true)
      const { data: settings, error } = await supabase.from('site_settings').select('*').single()
      
      if (settings) {
          setData({
              about_headline: settings.about_headline || "",
              about_bio: settings.about_bio || "",
              about_vision: settings.about_vision || "",
              contact_email: settings.contact_email || "",
              contact_phone: settings.contact_phone || "",
              contact_address: settings.contact_address || "",
              social_instagram: settings.social_instagram || ""
          })
      }
      setLoading(false)
  }

  useEffect(() => {
     fetchSettings()
  }, [])

  const handleSave = async () => {
      const { error } = await supabase.from('site_settings').upsert({
          id: 1,
          ...data,
          updated_at: new Date().toISOString()
      })

      if (!error) {
          toast.success("Konten berhasil disimpan")
      } else {
          toast.error("Gagal menyimpan konten")
      }
  }

  const handleChange = (key: string, value: string) => {
      setData(prev => ({ ...prev, [key]: value }))
  }

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
          {/* <TabsTrigger value="seo">Pengaturan SEO</TabsTrigger> */}
        </TabsList>

        {/* About Page Content */}
        <TabsContent value="about" className="space-y-4 mt-4">
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
                <Input 
                    id="headline" 
                    value={data.about_headline} 
                    onChange={e => handleChange('about_headline', e.target.value)} 
                    placeholder="Contoh: Capturing Moments..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Biografi Fotografer</Label>
                <Textarea 
                  id="bio" 
                  className="min-h-[150px]"
                  value={data.about_bio}
                  onChange={e => handleChange('about_bio', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vision">Visi Kami</Label>
                <Textarea 
                  id="vision" 
                  className="min-h-[100px]"
                  value={data.about_vision}
                  onChange={e => handleChange('about_vision', e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={loading}>
                <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Contact Page Content */}
        <TabsContent value="contact" className="space-y-4 mt-4">
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
                <Input 
                    id="email" type="email" 
                    value={data.contact_email} 
                    onChange={e => handleChange('contact_email', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telepon / WhatsApp</Label>
                <Input 
                    id="phone" 
                    value={data.contact_phone} 
                    onChange={e => handleChange('contact_phone', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Alamat Digital / Lokasi</Label>
                <Input 
                    id="address" 
                    value={data.contact_address} 
                    onChange={e => handleChange('contact_address', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ig">Username Instagram</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">@</span>
                  <Input 
                    id="ig" 
                    value={data.social_instagram} 
                    onChange={e => handleChange('social_instagram', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
               <Button onClick={handleSave} disabled={loading}>
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

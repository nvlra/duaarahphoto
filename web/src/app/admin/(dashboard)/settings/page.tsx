"use client"

import { useState, useEffect } from "react"
import { User } from "@supabase/supabase-js"
import { Save, Loader2, Building2, CreditCard, FileText, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/ios-toast"
import { supabase } from "@/lib/supabaseClient"
import { BusinessSettings } from "@/types/invoice"

export default function SettingsPage() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<BusinessSettings>({
    brand_name: "",
    brand_logo_url: "",
    brand_color: "#1e293b",
    bank_name: "",
    bank_number: "",
    bank_holder: "",
    address: "",
    footer_note: ""
  })

  const [settingsId, setSettingsId] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchUserAndSettings()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUserAndSettings = async () => {
    try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (user) {
            await fetchSettings(user.id)
        }
    } catch (error) {
        console.error("Error fetching user:", error)
    } finally {
        setLoading(false)
    }
  }

  const fetchSettings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('invoice_settings')
        .select('*')
        .eq('user_id', userId)
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
         console.error(error)
         toast.error("Error", "Gagal memuat pengaturan")
         return
      }

      if (data) {
        setSettingsId(data.id)
        setSettings({
            brand_name: data.brand_name || "",
            brand_logo_url: data.brand_logo_url || "",
            brand_color: data.brand_color || "#1e293b",
            bank_name: data.bank_name || "",
            bank_number: data.bank_number || "",
            bank_holder: data.bank_holder || "",
            address: data.address || "",
            footer_note: data.footer_note || ""
        })
      }
    } catch (err) {
       console.error(err)
    }
  }
  
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) {
          return
      }
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = user ? `${user.id}/${fileName}` : `${fileName}`

      try {
          setUploading(true)
          const { error: uploadError } = await supabase.storage.from('branding').upload(filePath, file)
          
          if (uploadError) {
              throw uploadError
          }

          const { data } = supabase.storage.from('branding').getPublicUrl(filePath)
          
          if (data) {
              handleChange("brand_logo_url", data.publicUrl)
              toast.success("Upload Berhasil", "Logo berhasil diunggah")
          }
      } catch (error: unknown) {
          console.error(error)
          const message = error instanceof Error ? error.message : "Unknown error occurred"
          toast.error("Gagal Upload", message)
      } finally {
          setUploading(false)
      }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
        const payload: any = {
            brand_name: settings.brand_name,
            brand_logo_url: settings.brand_logo_url,
            brand_color: settings.brand_color,
            bank_name: settings.bank_name,
            bank_number: settings.bank_number,
            bank_holder: settings.bank_holder,
            address: settings.address,
            footer_note: settings.footer_note,
        }

        if (user) {
            payload.user_id = user.id
        }

        if (user) {
            payload.user_id = user.id
        }

        // Use upsert to handle both insert and update scenarios
        // onConflict: 'user_id' ensures we update if the record exists
        const result = await supabase
            .from('invoice_settings')
            .upsert(payload, { onConflict: 'user_id' })
            .select()
        
        if (result.data && result.data.length > 0) {
            setSettingsId(result.data[0].id)
        }
        error = result.error

        if (error) throw error

        toast.success("Berhasil", "Pengaturan telah disimpan")
    } catch (err) {
        console.error(err)
        toast.error("Gagal", "Terjadi kesalahan saat menyimpan")
    } finally {
        setSaving(false)
    }
  }

  const handleChange = (key: keyof BusinessSettings, value: string) => {
      setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
      return (
          <div className="flex items-center justify-center min-h-[50vh]">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
      )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan Invoice</h1>
        <p className="text-muted-foreground">
          Kelola informasi perusahaan dan pembayaran yang tampil di invoice.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Identitas Bisnis
                    </CardTitle>
                    <CardDescription>Nama brand, warna, dan alamat.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="brand_name">Nama Brand / Bisnis</Label>
                            <Input 
                                id="brand_name" 
                                value={settings.brand_name} 
                                onChange={(e) => handleChange("brand_name", e.target.value)} 
                                placeholder="Contoh: Duaarah Photo"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="logo">Logo Perusahaan (Opsional)</Label>
                            <div className="flex flex-col gap-3">
                                {settings.brand_logo_url && (
                                    <div className="relative w-32 h-16 bg-muted/30 border rounded-md flex items-center justify-center">
                                         {/* eslint-disable-next-line @next/next/no-img-element */}
                                         <img 
                                            src={settings.brand_logo_url} 
                                            alt="Preview" 
                                            className="max-w-full max-h-full object-contain"
                                         />
                                         <button 
                                            type="button"
                                            onClick={() => handleChange("brand_logo_url", "")}
                                            className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 border border-red-200 hover:bg-red-200"
                                         >
                                            <Trash2 className="w-3 h-3" />
                                         </button>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                     <Input 
                                        id="logo" 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        disabled={uploading}
                                        className="text-xs"
                                     />
                                     {uploading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                                </div>
                                <p className="text-[10px] text-muted-foreground">Format PNG/JPG. Max 2MB.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="brand_color">Warna Brand (Hex)</Label>
                            <div className="flex gap-2">
                                <Input 
                                    id="brand_color" 
                                    type="color"
                                    className="w-12 p-1 h-10 cursor-pointer"
                                    value={settings.brand_color} 
                                    onChange={(e) => handleChange("brand_color", e.target.value)} 
                                />
                                <Input 
                                    value={settings.brand_color} 
                                    onChange={(e) => handleChange("brand_color", e.target.value)} 
                                    placeholder="#000000"
                                    className="flex-1 font-mono"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Alamat Lengkap</Label>
                        <Textarea 
                            id="address" 
                            value={settings.address} 
                            onChange={(e) => handleChange("address", e.target.value)} 
                            placeholder="Alamat lengkap perusahaan..."
                            rows={2}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Rekening Pembayaran
                    </CardTitle>
                    <CardDescription>Informasi bank untuk transfer pembayaran.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="bank_name">Nama Bank</Label>
                            <Input 
                                id="bank_name" 
                                value={settings.bank_name} 
                                onChange={(e) => handleChange("bank_name", e.target.value)} 
                                placeholder="Contoh: BCA"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bank_number">Nomor Rekening</Label>
                            <Input 
                                id="bank_number" 
                                value={settings.bank_number} 
                                onChange={(e) => handleChange("bank_number", e.target.value)} 
                                placeholder="Contoh: 1234567890"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="bank_holder">Atas Nama</Label>
                            <Input 
                                id="bank_holder" 
                                value={settings.bank_holder} 
                                onChange={(e) => handleChange("bank_holder", e.target.value)} 
                                placeholder="Nama pemilik rekening"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Footer Note
                    </CardTitle>
                    <CardDescription>Syarat & Ketentuan yang muncul di bagian bawah invoice.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="footer_note">Catatan / Terms</Label>
                        <Textarea 
                            id="footer_note" 
                            value={settings.footer_note} 
                            onChange={(e) => handleChange("footer_note", e.target.value)} 
                            placeholder="1. DP non-refundable..."
                            rows={4}
                        />
                         <p className="text-[0.8rem] text-muted-foreground">
                            Gunakan Baris baru (Enter) untuk memisahkan poin.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end pb-8">
                <Button type="submit" size="lg" disabled={saving} className="min-w-[150px]">
                    {saving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
                        </>
                    )}
                </Button>
            </div>
        </div>
      </form>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Save, Loader2, Building2, CreditCard, FileText } from "lucide-react"
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
    brand_color: "#1e293b",
    bank_name: "",
    bank_number: "",
    bank_holder: "",
    address: "",
    footer_note: ""
  })

  // We need the ID to update the specific row, assuming single row table
  const [settingsId, setSettingsId] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSettings = async () => {
    try {
      setLoading(true)
      // Get the first row
      const { data, error } = await supabase
        .from('invoice_settings')
        .select('*')
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
         console.error(error)
         toast.error("Error", "Gagal memuat pengaturan")
         return
      }

      if (data) {
        setSettingsId(data.id)
        setSettings({
            brand_name: data.brand_name || "",
            brand_color: data.brand_color || "#1e293b",
            bank_name: data.bank_name || "",
            bank_number: data.bank_number || "",
            bank_holder: data.bank_holder || "",
            address: data.address || "",
            footer_note: data.footer_note || ""
        })
      } else {
        // No row exists, we will create one on save
      }
    } catch (err) {
       console.error(err)
    } finally {
       setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
        const payload = {
            brand_name: settings.brand_name,
            brand_color: settings.brand_color,
            bank_name: settings.bank_name,
            bank_number: settings.bank_number,
            bank_holder: settings.bank_holder,
            address: settings.address,
            footer_note: settings.footer_note,
            // updated_at: new Date().toISOString() // if column exists
        }

        let error;
        
        if (settingsId) {
            // Update
            const result = await supabase.from('invoice_settings').update(payload).eq('id', settingsId)
            error = result.error
        } else {
            // Insert
            const result = await supabase.from('invoice_settings').insert(payload).select()
            if (result.data && result.data[0]) {
                setSettingsId(result.data[0].id)
            }
            error = result.error
        }

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
            {/* BRANDING */}
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

            {/* BANK ACCOUNT */}
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
            
            {/* NOTES */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Catatan Kaki
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

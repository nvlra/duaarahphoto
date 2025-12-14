"use client"

// import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
// import { toast } from "sonner" removed 
import { useToast } from "@/components/ui/ios-toast"
import { Loader2 } from "lucide-react"

export default function AdminLogin() {
  const router = useRouter()
  const toast = useToast()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Helper: If no '@', assume it's a username and append dummy domain
    // This connects their "enviel" username to "enviel@admin.com" Supabase Auth User
    const emailToUse = identifier.includes("@") ? identifier : `${identifier}@admin.com`

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      })

      if (error) {
        toast.error("Login gagal: " + error.message)
      } else {
        toast.success("Login berhasil!")
        router.push("/admin")
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ... (Google login handler if needed)

  return (
    <div className="flex h-screen w-full items-center justify-center px-4 bg-muted/20">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Login Admin</CardTitle>
          <CardDescription>
            Masukkan username/email dan password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Username / Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="enviel atau admin@contoh.com"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {/* 
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  Lupa password?
                </Link> 
                */}
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Masuk
            </Button>
            {/* Optional: Release Google login only if configured
            <Button variant="outline" className="w-full" type="button" onClick={handleGoogleLogin}>
              Masuk dengan Google
            </Button>
            */}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

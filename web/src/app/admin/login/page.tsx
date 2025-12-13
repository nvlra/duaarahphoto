"use client"

import Link from "next/link"
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
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
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

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin`
      }
    })
    if (error) toast.error(error.message)
      // Loading state persists because of redirect
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4 bg-muted/20">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Login Admin</CardTitle>
          <CardDescription>
            Masukkan email dan password untuk akses dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@contoh.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

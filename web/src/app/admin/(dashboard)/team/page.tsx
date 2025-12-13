"use client"

import { useState } from "react"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Mail,
  Briefcase,
  Settings,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

import { TEAM_DATA, TeamMember } from "@/config/team-data"

// Mock Data (using shared source)
const initialTeam: TeamMember[] = TEAM_DATA

const initialRoles = [
  "Fotografer Utama", "Fotografer 2nd", "Videographer", "Editor", "Makeup Artist", "Assistant", "Admin"
]

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>(initialTeam)
  const [roles, setRoles] = useState<string[]>(initialRoles)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isRoleManagerOpen, setIsRoleManagerOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)

  // Filter team based on search query
  const filteredTeam = team.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination Logic
  const totalPages = Math.ceil(filteredTeam.length / itemsPerPage)
  const paginatedItems = filteredTeam.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleSaveMember = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    if (editingMember) {
      // Edit Mode
      setTeam(team.map(t => t.id === editingMember.id ? {
        ...t,
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        status: formData.get("status") as "active" | "inactive",
      } : t))
      toast.success("Data anggota berhasil diperbarui")
    } else {
      // Add Mode
      const newMember: TeamMember = {
        id: `TM-${Math.floor(Math.random() * 1000)}`,
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        status: formData.get("status") as "active" | "inactive",
        joinedDate: new Date().toISOString().split("T")[0]
      }
      setTeam([...team, newMember])
      toast.success("Anggota baru berhasil ditambahkan")
    }
    
    setIsAddDialogOpen(false)
    setEditingMember(null)
  }

  const handleDeleteMember = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus anggota ini?")) {
      setTeam(team.filter(t => t.id !== id))
      toast.success("Anggota berhasil dihapus")
    }
  }

  const openEditDialog = (member: TeamMember) => {
    setEditingMember(member)
    setIsAddDialogOpen(true)
  }

  const handleAddRole = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newRole = formData.get("newRole") as string
    if (newRole && !roles.includes(newRole)) {
      setRoles([...roles, newRole])
      const input = document.getElementById("newRole") as HTMLInputElement
      if (input) input.value = ""
      toast.success("Role baru berhasil ditambahkan")
    }
  }

  const handleDeleteRole = (roleToDelete: string) => {
    if (confirm(`Hapus role "${roleToDelete}"?`)) {
      setRoles(roles.filter(r => r !== roleToDelete))
      toast.success("Role berhasil dihapus")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kelola Tim</h2>
          <p className="text-muted-foreground">
            Daftar karyawan dan freelancer Duaarah Photo.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsRoleManagerOpen(true)}>
            <Settings className="mr-2 h-4 w-4" /> Kelola Role
          </Button>
          <Button onClick={() => { setEditingMember(null); setIsAddDialogOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Anggota
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg font-medium">Daftar Anggota ({filteredTeam.length})</CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama, role, atau email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => {
                   setSearchQuery(e.target.value)
                   setCurrentPage(1) // Reset to page 1 on search
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama & Kontak</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Bergabung</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-sm">{member.name}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                         <Mail className="h-3 w-3" /> {member.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <Badge variant="secondary" className="px-2.5 py-0.5 text-sm font-medium">
                          <Briefcase className="mr-1.5 h-3.5 w-3.5 opacity-70" />
                          {member.role}
                       </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        member.status === "active" 
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-transparent dark:bg-emerald-500/15 dark:text-emerald-400" 
                          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-100 border-transparent dark:bg-zinc-800 dark:text-zinc-400"
                      }
                    >
                      {member.status === "active" ? "Aktif" : "Non-Aktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(member.joinedDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openEditDialog(member)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit Data
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMember(member.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Hapus Anggota
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedItems.length === 0 && (
                 <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                       Tidak ada anggota yang ditemukan.
                    </TableCell>
                 </TableRow>
              )}
            </TableBody>
          </Table>
          </div>

          {/* Mobile Card View (Compact) */}
          <div className="grid gap-3 md:hidden">
             {paginatedItems.map((member) => (
                <div key={member.id} className="flex flex-col gap-2 p-3 border rounded-lg bg-card/50 text-sm">
                   <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                         <div className="font-semibold">{member.name}</div>
                         <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {member.email}
                         </div>
                      </div>
                      <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-1">
                               <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openEditDialog(member)}>
                               <Pencil className="mr-2 h-4 w-4" /> Edit Data
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMember(member.id)}>
                               <Trash2 className="mr-2 h-4 w-4" /> Hapus
                            </DropdownMenuItem>
                         </DropdownMenuContent>
                      </DropdownMenu>
                   </div>
                   
                   <div className="flex flex-wrap gap-2 items-center">
                      <Badge variant="secondary" className="px-2 py-0 text-[10px] font-medium h-5">
                         {member.role}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={
                           member.status === "active" 
                             ? "bg-emerald-100/50 text-emerald-700 border-transparent dark:bg-emerald-500/10 dark:text-emerald-400 text-[10px] px-2 py-0 h-5" 
                             : "bg-zinc-100 text-zinc-700 border-transparent dark:bg-zinc-800 dark:text-zinc-400 text-[10px] px-2 py-0 h-5"
                        }
                      >
                        {member.status === "active" ? "Aktif" : "Non-Aktif"}
                      </Badge>
                   </div>
                      
                   <div className="text-[10px] text-muted-foreground pt-2 border-t mt-1">
                      Bergabung: {new Date(member.joinedDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                   </div>
                </div>
             ))}
             {paginatedItems.length === 0 && (
                <div className="p-6 text-center text-muted-foreground text-xs border border-dashed rounded-lg">
                   Tidak ada anggota yang ditemukan.
                </div>
             )}
          </div>

          {/* Pagination Controls */}
          {filteredTeam.length > 0 && (
             <div className="flex items-center justify-end space-x-2 py-4">
               <div className="flex-1 text-sm text-muted-foreground">
                 Halaman {currentPage} dari {totalPages}
               </div>
               <div className="space-x-2">
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={handlePrevPage}
                   disabled={currentPage === 1}
                 >
                   <ChevronLeft className="h-4 w-4" />
                   <span className="sr-only">Previous</span>
                 </Button>
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={handleNextPage}
                   disabled={currentPage === totalPages}
                 >
                   <ChevronRight className="h-4 w-4" />
                   <span className="sr-only">Next</span>
                 </Button>
               </div>
             </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSaveMember}>
            <DialogHeader>
              <DialogTitle>{editingMember ? "Edit Anggota Tim" : "Tambah Anggota Tim"}</DialogTitle>
              <DialogDescription>
                {editingMember ? "Perbarui informasi anggota tim ini." : "Masukkan data anggota tim baru untuk ditambahkan ke database."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nama</Label>
                <Input id="name" name="name" defaultValue={editingMember?.name} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Peran</Label>
                <Select name="role" defaultValue={editingMember?.role} required>
                   <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih peran" />
                   </SelectTrigger>
                   <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                   </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={editingMember?.email} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">No. HP</Label>
                <Input id="phone" name="phone" defaultValue={editingMember?.phone} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="status" className="text-right">Status</Label>
                 <Select name="status" defaultValue={editingMember?.status || "active"}>
                    <SelectTrigger className="col-span-3">
                       <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="active">Aktif</SelectItem>
                       <SelectItem value="inactive">Non-Aktif</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Role Manager Dialog */}
      <Dialog open={isRoleManagerOpen} onOpenChange={setIsRoleManagerOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Kelola Role / Peran</DialogTitle>
            <DialogDescription>
              Tambah atau hapus opsi peran untuk anggota tim.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
             {/* Add Role Form */}
             <form onSubmit={handleAddRole} className="flex gap-2">
                <Input id="newRole" name="newRole" placeholder="Nama Role Baru (misal: Supir)" required />
                <Button type="submit" size="icon">
                   <Plus className="h-4 w-4" />
                </Button>
             </form>

             {/* Role List */}
             <div className="border rounded-md divide-y max-h-[300px] overflow-y-auto">
                {roles.map((role) => (
                   <div key={role} className="flex items-center justify-between p-2 text-sm">
                      <span>{role}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-red-500"
                        onClick={() => handleDeleteRole(role)}
                      >
                         <X className="h-3 w-3" />
                      </Button>
                   </div>
                ))}
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

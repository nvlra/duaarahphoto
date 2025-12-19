"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/ios-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Loader2, Plus, ArrowLeft, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Project {
  id: number;
  title: string;
  slug: string;
  category: string;
  date: string;
  location: string;
  description: string;
  cover_image: string;
  gallery_images: string[];
}

export default function ProjectsPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [view, setView] = useState<"list" | "editor">("list");
  
  // Editor State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Project>({
    id: 0,
    title: "",
    slug: "",
    category: "",
    date: "",
    location: "",
    description: "",
    cover_image: "",
    gallery_images: []
  });
  const [saving, setSaving] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error("Gagal memuat projects", "Gagal memuat data project.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateNew = () => {
    setEditingId(null);
    setFormData({
        id: 0,
        title: "",
        slug: "",
        category: "",
        date: "",
        location: "",
        description: "",
        cover_image: "",
        gallery_images: []
    });
    setView("editor");
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData(project);
    setView("editor");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
        // 1. Get Project Data
        const { data: project, error: fetchError } = await supabase
            .from('projects')
            .select('cover_image, gallery_images')
            .eq('id', id)
            .single();
        
        if (fetchError) throw fetchError;

        // 2. Prepare paths to delete
        const pathsToDelete: string[] = [];
        
        const getPath = (url: string) => {
            if (!url) return null;
            const parts = url.split('/portfolio/');
            return parts.length > 1 ? parts[1] : null;
        };

        if (project.cover_image) {
            const path = getPath(project.cover_image);
            if (path) pathsToDelete.push(path);
        }

        if (project.gallery_images && project.gallery_images.length > 0) {
            project.gallery_images.forEach((url: string) => {
                const path = getPath(url);
                if (path) pathsToDelete.push(path);
            });
        }

        // 3. Delete files from Storage
        if (pathsToDelete.length > 0) {
            const { error: storageError } = await supabase.storage.from('portfolio').remove(pathsToDelete);
            if (storageError) console.error("Storage cleanup failed:", storageError);
        }

        // 4. Delete Record
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) throw error;
        
        toast.success("Project and files deleted");
        fetchProjects();
    } catch (error) {
        console.error(error);
        toast.error("Failed to delete", "Terjadi kesalahan saat menghapus project.");
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug) {
        toast.error("Validation Error", "Title and Slug are required.");
        return;
    }

    setSaving(true);
    try {
        const payload = {
            title: formData.title,
            slug: formData.slug,
            category: formData.category,
            date: formData.date,
            location: formData.location,
            description: formData.description,
            cover_image: formData.cover_image,
            gallery_images: formData.gallery_images
        };

        if (editingId) {
            const { error } = await supabase.from('projects').update(payload).eq('id', editingId);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('projects').insert(payload);
            if (error) throw error;
        }

        toast.success("Success", "Project saved successfully.");
        setView("list");
        fetchProjects();
    } catch (error) {
        console.error("Save error:", error);
        toast.error("Failed to save", "Terjadi kesalahan saat menyimpan.");
    } finally {
        setSaving(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
        const fileName = `cover-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const { error } = await supabase.storage.from('portfolio').upload(fileName, file);
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(fileName);
        setFormData(prev => ({ ...prev, cover_image: publicUrl }));
        toast.success("Cover uploaded");
    } catch (error) {
        console.error(error);
        toast.error("Upload failed", "Gagal upload cover.");
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
        const newUrls: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileName = `gallery-${Date.now()}-${i}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const { error } = await supabase.storage.from('portfolio').upload(fileName, file);
            if (error) throw error;
            
            const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(fileName);
            newUrls.push(publicUrl);
        }

        setFormData(prev => ({ ...prev, gallery_images: [...prev.gallery_images, ...newUrls] }));
        toast.success(`${newUrls.length} images uploaded`);
    } catch (error) {
        console.error(error);
        toast.error("Upload failed", "Gagal upload gallery.");
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
        ...prev,
        gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }));
  };

  const generateSlug = (title: string) => {
      return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  if (view === "editor") {
      return (
          <div className="space-y-6 max-w-5xl mx-auto pb-20">
              <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={() => setView("list")}>
                      <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <h1 className="text-3xl font-bold tracking-tight">{editingId ? "Edit Project" : "New Project"}</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="md:col-span-2 space-y-6">
                      <Card>
                          <CardHeader>
                              <CardTitle>Project Details</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                              <div className="space-y-2">
                                  <Label>Title</Label>
                                  <Input 
                                      value={formData.title}
                                      onChange={(e) => {
                                          const title = e.target.value;
                                          setFormData(prev => ({ ...prev, title, slug: !editingId ? generateSlug(title) : prev.slug }));
                                      }}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <Label>Slug (URL)</Label>
                                  <Input 
                                      value={formData.slug}
                                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <Label>Description</Label>
                                  <RichTextEditor 
                                      value={formData.description}
                                      onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
                                      className="min-h-[300px]"
                                  />
                              </div>
                          </CardContent>
                      </Card>

                      <Card>
                          <CardHeader>
                              <CardTitle>Gallery Images</CardTitle>
                              <CardDescription>Upload multiple images for the project slider.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                                  {formData.gallery_images.map((url, index) => (
                                      <div key={index} className="relative aspect-square rounded-md overflow-hidden group bg-muted">
                                          <Image src={url} alt="Gallery" fill className="object-cover" />
                                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                              <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => removeGalleryImage(index)}>
                                                  <Trash2 className="w-4 h-4" />
                                              </Button>
                                          </div>
                                      </div>
                                  ))}
                                  <label className="flex flex-col items-center justify-center aspect-square rounded-md border-2 border-dashed border-muted-foreground/25 hover:bg-muted/50 cursor-pointer transition-colors">
                                      <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                                      <span className="text-xs text-muted-foreground">Add Images</span>
                                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryUpload} />
                                  </label>
                              </div>
                          </CardContent>
                      </Card>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                      <Card>
                          <CardHeader>
                              <CardTitle>Meta Info</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                              <div className="space-y-2">
                                  <Label>Category</Label>
                                  <Input 
                                      value={formData.category}
                                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                      placeholder="e.g. Wedding, Elopement"
                                  />
                              </div>
                              <div className="space-y-2">
                                  <Label>Date/Season</Label>
                                  <Input 
                                      value={formData.date}
                                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                      placeholder="e.g. Summer 2024"
                                  />
                              </div>
                              <div className="space-y-2">
                                  <Label>Location</Label>
                                  <Input 
                                      value={formData.location}
                                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                      placeholder="e.g. Bali, Indonesia"
                                  />
                              </div>
                          </CardContent>
                      </Card>

                      <Card>
                          <CardHeader>
                              <CardTitle>Cover Image</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                              <div className="relative aspect-video w-full rounded-md overflow-hidden bg-muted border">
                                  {formData.cover_image ? (
                                      <Image src={formData.cover_image} alt="Cover" fill className="object-cover" />
                                  ) : (
                                      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No Cover</div>
                                  )}
                              </div>
                              <Input type="file" accept="image/*" onChange={handleCoverUpload} />
                          </CardContent>
                      </Card>

                      <Button className="w-full" size="lg" onClick={handleSave} disabled={saving}>
                          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {saving ? "Saving..." : "Save Project"}
                      </Button>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Portfolio Projects</h1>
            <p className="text-muted-foreground">Manage your full portfolio projects.</p>
        </div>
        <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <Card>
          <Table>
              <TableHeader>
                  <TableRow>
                      <TableHead>Cover</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {loading ? (
                      <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                              <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                          </TableCell>
                      </TableRow>
                  ) : projects.length === 0 ? (
                      <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              No projects found. Create one to get started.
                          </TableCell>
                      </TableRow>
                  ) : (
                      projects.map((project) => (
                          <TableRow key={project.id}>
                              <TableCell>
                                  <div className="relative w-12 h-12 rounded overflow-hidden bg-muted">
                                      {project.cover_image && (
                                          <Image src={project.cover_image} alt={project.title} fill className="object-cover" />
                                      )}
                                  </div>
                              </TableCell>
                              <TableCell className="font-medium">{project.title}</TableCell>
                              <TableCell>{project.category}</TableCell>
                              <TableCell>{project.date}</TableCell>
                              <TableCell className="text-right space-x-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>Edit</Button>
                                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(project.id)}>
                                      <Trash2 className="w-4 h-4" />
                                  </Button>
                              </TableCell>
                          </TableRow>
                      ))
                  )}
              </TableBody>
          </Table>
      </Card>
    </div>
  );
}

"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/ios-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FeaturedItem = { id: number; title: string; imageUrl: string };
type PricingTier = { name: string; description: string; price: string; features: string[]; popular: boolean; icon: string };
type TestimonialItem = { id: number; name: string; designation: string; quote: string; src: string };

interface HeroContent {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
}

interface AboutContent {
  title: string;
  content: string;
  imageUrl: string;
}

interface FeaturedContent {
  intro: { title: string; description: string; ctaText: string; ctaLink: string };
  items: FeaturedItem[];
}

interface PricingContent {
  intro: { title: string; description: string };
  tiers: PricingTier[];
}

interface TestimonialsContent {
  title: string;
  description: string;
  items: TestimonialItem[];
}

interface FooterContent {
  brandName: string;
  copyrightText: string;
  instagramLink: string;
  whatsappLink: string;
}

type SectionContent = HeroContent | AboutContent | FeaturedContent | PricingContent | TestimonialsContent | FooterContent;

export default function LandingPageAdmin() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Hero State
  const [heroData, setHeroData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    ctaText: "Contact Us"
  });

  // About State
  const [aboutData, setAboutData] = useState({
    title: "",
    content: "",
    imageUrl: ""
  });

  // Featured State
  const [featuredData, setFeaturedData] = useState({
    intro: {
      title: "",
      description: "",
      ctaText: "View Portfolio",
      ctaLink: "/portfolio"
    },
    items: [] as { id: number; title: string; imageUrl: string }[]
  });

  // Pricing State
  const [pricingData, setPricingData] = useState({
    intro: {
        title: "Services",
        description: "We believe in transparency and providing value that lasts a lifetime."
    },
    tiers: [] as { 
        name: string; 
        description: string; 
        price: string; 
        features: string[]; 
        popular: boolean; 
        icon: string; 
    }[]
  });

  // Testimonials State
  const [testimonialsData, setTestimonialsData] = useState({
    title: "Testimoni",
    description: "Kind words from the beautiful souls we've had the privilege to capture.",
    items: [] as { id: number; name: string; designation: string; quote: string; src: string }[]
  });

  // Footer State
  const [footerData, setFooterData] = useState({
    brandName: "ENVIEL",
    copyrightText: "© 2024 Enviel Phoject.",
    instagramLink: "https://instagram.com/nvlra",
    whatsappLink: "https://wa.me/6281200000000"
  });

  const [activeTab, setActiveTab] = useState("hero");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .in('key', ['hero', 'about', 'featured', 'pricing', 'testimonials', 'footer']);
        
      if (error) throw error;
      
      if (data) {
        const hero = data.find(item => item.key === 'hero');
        if (hero) setHeroData(hero.content);

        const about = data.find(item => item.key === 'about');
        if (about) setAboutData(about.content);

        const featured = data.find(item => item.key === 'featured');
        if (featured) {
            setFeaturedData({
                intro: featured.content.intro || { title: "", description: "", ctaText: "View Portfolio", ctaLink: "/portfolio" },
                items: featured.content.items || []
            });
        }

        const pricing = data.find(item => item.key === 'pricing');
        if (pricing) {
            setPricingData({
                intro: pricing.content.intro || { title: "Services", description: "..." },
                tiers: pricing.content.tiers || []
            });
        }

        const testimonials = data.find(item => item.key === 'testimonials');
        if (testimonials) {
            setTestimonialsData({
                title: testimonials.content.title || "Testimoni",
                description: testimonials.content.description || "...",
                items: testimonials.content.items || []
            });
        }

        const footer = data.find(item => item.key === 'footer');
        if (footer) {
            setFooterData({
                brandName: footer.content.brandName || "ENVIEL",
                copyrightText: footer.content.copyrightText || "© 2024 Enviel Phoject.",
                instagramLink: footer.content.instagramLink || "https://instagram.com/nvlra",
                whatsappLink: footer.content.whatsappLink || "https://wa.me/6281200000000"
            });
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error("Gagal memuat data", "Gagal memuat data landing page.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        toast.error("Format salah", "Harap upload file gambar.");
        return;
    }
    if (file.size > 2 * 1024 * 1024) {
        toast.error("File terlalu besar", "Ukuran gambar maksimal 2MB");
        return;
    }

    try {
      // Cleanup old image
      let oldUrl = "";
      if (section === 'hero') oldUrl = heroData.imageUrl;
      else if (section === 'about') oldUrl = aboutData.imageUrl;

      if (oldUrl) {
          const parts = oldUrl.split('/landing-assets/');
          if (parts.length > 1) {
              await supabase.storage.from('landing-assets').remove([parts[1]]);
          }
      }

      const fileName = `${section}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const { error } = await supabase.storage.from('landing-assets').upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('landing-assets').getPublicUrl(fileName);

      if (section === 'hero') setHeroData(prev => ({ ...prev, imageUrl: publicUrl }));
      else if (section === 'about') setAboutData(prev => ({ ...prev, imageUrl: publicUrl }));
      
      toast.success("Berhasil Upload", "Gambar berhasil diunggah.");
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Gagal Upload", "Terjadi kesalahan saat mengunggah gambar.");
    }
  };

  const handleFeaturedItemUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
        toast.error("Error", "File harus gambar & max 2MB");
        return;
    }

    try {
      // Cleanup old item image
      const oldUrl = featuredData.items[index]?.imageUrl;
      if (oldUrl) {
          const parts = oldUrl.split('/landing-assets/');
          if (parts.length > 1) {
              await supabase.storage.from('landing-assets').remove([parts[1]]);
          }
      }

      const fileName = `featured-${Date.now()}-${index}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const { error } = await supabase.storage.from('landing-assets').upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('landing-assets').getPublicUrl(fileName);

      const newItems = [...featuredData.items];
      newItems[index] = { ...newItems[index], imageUrl: publicUrl };
      setFeaturedData(prev => ({ ...prev, items: newItems }));
      
      toast.success("Berhasil", "Gambar item berhasil diupdate.");
    } catch (error) {
        console.error(error);
        toast.error("Gagal", "Upload gagal.");
    }
  };

  const addFeaturedItem = () => {
    if (featuredData.items.length >= 5) {
        toast.error("Maksimal 5 Item", "Agar tampilan rapi, maksimal 5 foto di accordion.");
        return;
    }
    const newItem = { id: Date.now(), title: "New Project", imageUrl: "" };
    setFeaturedData(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeFeaturedItem = async (index: number) => {
    // Cleanup image
    const item = featuredData.items[index];
    if (item?.imageUrl) {
        const parts = item.imageUrl.split('/landing-assets/');
        if (parts.length > 1) {
            await supabase.storage.from('landing-assets').remove([parts[1]]);
        }
    }

    const newItems = featuredData.items.filter((_, i) => i !== index);
    setFeaturedData(prev => ({ ...prev, items: newItems }));
  };
  
  const updateFeaturedItem = (index: number, field: string, value: string) => {
    const newItems = [...featuredData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFeaturedData(prev => ({ ...prev, items: newItems }));
  };

  // Pricing Handlers
  const addPricingTier = () => {
    const newTier = { 
        name: "New Package", 
        description: "Description here", 
        price: "", 
        features: ["Feature 1", "Feature 2"], 
        popular: false, 
        icon: "Camera" 
    };
    setPricingData((prev) => ({ ...prev, tiers: [...prev.tiers, newTier] }));
  };

  const removePricingTier = (index: number) => {
    const newTiers = pricingData.tiers.filter((_, i) => i !== index);
    setPricingData((prev) => ({ ...prev, tiers: newTiers }));
  };

  const updatePricingTier = (index: number, field: string, value: string | boolean | string[]) => {
    const newTiers = [...pricingData.tiers];
    const updatedTier = { ...newTiers[index], [field]: value };
    newTiers[index] = updatedTier as PricingTier;
    setPricingData((prev) => ({ ...prev, tiers: newTiers }));
  };
   
  const updatePricingFeatures = (index: number, text: string) => {
      const features = text.split('\n');
      updatePricingTier(index, 'features', features);
  };

  // Testimonials Handlers
  const handleTestimonialUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
        toast.error("Error", "File harus gambar & max 2MB");
        return;
    }

    try {
      // Cleanup old testimonial image
      const oldUrl = testimonialsData.items[index]?.src;
      if (oldUrl) {
          const parts = oldUrl.split('/landing-assets/');
          if (parts.length > 1) {
              await supabase.storage.from('landing-assets').remove([parts[1]]);
          }
      }

      const fileName = `testimonial-${Date.now()}-${index}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const { error } = await supabase.storage.from('landing-assets').upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('landing-assets').getPublicUrl(fileName);

      const newItems = [...testimonialsData.items];
      newItems[index] = { ...newItems[index], src: publicUrl };
      setTestimonialsData(prev => ({ ...prev, items: newItems }));
      
      toast.success("Berhasil", "Foto berhasil diupdate.");
    } catch (error) {
        console.error(error);
        toast.error("Gagal", "Upload gagal.");
    }
  };

  const addTestimonial = () => {
    const newItem = { id: Date.now(), name: "Client Name", designation: "Wedding Location", quote: "Wonderful experience!", src: "" };
    setTestimonialsData(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeTestimonial = async (index: number) => {
    // Cleanup image
    const item = testimonialsData.items[index];
    if (item?.src) {
        const parts = item.src.split('/landing-assets/');
        if (parts.length > 1) {
            await supabase.storage.from('landing-assets').remove([parts[1]]);
        }
    }

    const newItems = testimonialsData.items.filter((_, i) => i !== index);
    setTestimonialsData(prev => ({ ...prev, items: newItems }));
  };

  const updateTestimonial = (index: number, field: string, value: string) => {
    const newItems = [...testimonialsData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setTestimonialsData(prev => ({ ...prev, items: newItems }));
  };

  const saveSection = async (key: string, content: SectionContent) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('page_sections')
        .upsert({ 
            key, 
            content,
            updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success("Berhasil Disimpan!", "Perubahan telah tersimpan di database.");
      
      await fetchData();
    } catch (error) {
      console.error('Save error:', error);
      toast.error("Gagal Menyimpan", "Periksa koneksi internet atau database.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Landing Page Content</h1>
        <p className="text-muted-foreground">Manage the content of your public landing page.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="about">About Section</TabsTrigger>
          <TabsTrigger value="featured">Featured / Portfolio</TabsTrigger>
          <TabsTrigger value="pricing">Pricing / Services</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="other" disabled>Others</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Customize the main banner at the top of your home page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="title">Main Title</Label>
                <div className="grid gap-4">
                    <RichTextEditor 
                        value={heroData.title} 
                        onChange={(val) => setHeroData(prev => ({ ...prev, title: val }))} 
                        className="min-h-[100px]"
                    />
                    
                    <div className="rounded-md border p-4 bg-muted/30">
                        <Label className="text-xs text-muted-foreground mb-2 block">Live Preview (Rendered Result)</Label>
                        <h1 
                            className="font-playfair text-4xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-100"
                            dangerouslySetInnerHTML={{ __html: heroData.title || "Preview..." }}
                        />
                    </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea 
                    id="subtitle" 
                    name="subtitle" 
                    value={heroData.subtitle} 
                    onChange={(e) => setHeroData(prev => ({ ...prev, subtitle: e.target.value }))} 
                    placeholder="Start your visual journey with us..."
                    className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Hero Image</Label>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="relative w-full md:w-64 aspect-4/5 rounded-lg overflow-hidden border bg-muted">
                        {heroData.imageUrl ? (
                            <Image 
                                src={heroData.imageUrl} 
                                alt="Hero Preview" 
                                fill 
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                No Image
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 space-y-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="hero-image">Upload New Image</Label>
                            <Input 
                                id="hero-image" 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'hero')}
                            />
                            <p className="text-xs text-muted-foreground">Recommended: Portrait orientation, high quality (max 2MB).</p>
                        </div>
                        
                        <div className="space-y-1">
                            <Label htmlFor="imageUrl">Or Image URL</Label>
                            <Input 
                                id="imageUrl" 
                                name="imageUrl" 
                                value={heroData.imageUrl} 
                                onChange={(e) => setHeroData(prev => ({ ...prev, imageUrl: e.target.value }))} 
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button onClick={() => saveSection('hero', heroData)} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
            <Card>
                <CardHeader>
                    <CardTitle>About Section</CardTitle>
                    <CardDescription>
                        Tell your story. This allows for rich text formatting.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Heading</Label>
                        <RichTextEditor 
                            value={aboutData.title}
                            onChange={(val) => setAboutData(prev => ({ ...prev, title: val }))}
                            className="min-h-[80px]"
                        />
                         <div className="rounded-md border p-4 bg-muted/30">
                            <h2 
                                className="font-playfair text-2xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100"
                                dangerouslySetInnerHTML={{ __html: aboutData.title || "Cinematic. Timeless..." }}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Content (Paragraphs)</Label>
                        <RichTextEditor 
                            value={aboutData.content}
                            onChange={(val) => setAboutData(prev => ({ ...prev, content: val }))}
                            className="min-h-[200px]"
                        />
                         <div className="rounded-md border p-4 bg-muted/30">
                            <div 
                                className="prose dark:prose-invert max-w-none text-sm"
                                dangerouslySetInnerHTML={{ __html: aboutData.content || "Description..." }}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>About Image</Label>
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="relative w-full md:w-64 aspect-video rounded-lg overflow-hidden border bg-muted">
                                {aboutData.imageUrl ? (
                                    <Image 
                                        src={aboutData.imageUrl} 
                                        alt="About Preview" 
                                        fill 
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        No Image
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex-1 space-y-4">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="about-image">Upload New Image</Label>
                                    <Input 
                                        id="about-image" 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'about')}
                                    />
                                    <p className="text-xs text-muted-foreground">Recommended: Landscape or wide aspect ratio.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button onClick={() => saveSection('about', aboutData)} disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="featured">
            <Card>
                <CardHeader>
                    <CardTitle>Featured Section / Portfolio</CardTitle>
                    <CardDescription>
                        A showcase of your best work (Accordion Style) and the introductory text.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Intro Section */}
                    <div className="space-y-4 border-b pb-6">
                        <h3 className="text-lg font-semibold">Intro & CTA</h3>
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <RichTextEditor 
                                    value={featuredData.intro.title}
                                    onChange={(val) => setFeaturedData(prev => ({ ...prev, intro: { ...prev.intro, title: val } }))}
                                    className="min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <RichTextEditor 
                                    value={featuredData.intro.description}
                                    onChange={(val) => setFeaturedData(prev => ({ ...prev, intro: { ...prev.intro, description: val } }))}
                                    className="min-h-[100px]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>CTA Text</Label>
                                    <Input 
                                        value={featuredData.intro.ctaText}
                                        onChange={(e) => setFeaturedData(prev => ({ ...prev, intro: { ...prev.intro, ctaText: e.target.value } }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>CTA Link</Label>
                                    <Input 
                                        value={featuredData.intro.ctaLink}
                                        onChange={(e) => setFeaturedData(prev => ({ ...prev, intro: { ...prev.intro, ctaLink: e.target.value } }))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Accordion Gallery Items</h3>
                            <Button variant="outline" size="sm" onClick={addFeaturedItem}>
                                <Plus className="w-4 h-4 mr-2" /> Add Item
                            </Button>
                        </div>
                        
                        <div className="grid gap-4">
                            {featuredData.items.length === 0 && (
                                <p className="text-muted-foreground text-sm italic">No items yet. Add one to start.</p>
                            )}
                            {featuredData.items.map((item, index) => (
                                <div key={item.id} className="flex flex-col md:flex-row gap-4 border p-4 rounded-lg bg-muted/20 items-start">
                                    {/* Image Preview/Upload */}
                                    <div className="w-full md:w-32 h-40 md:h-32 relative bg-muted rounded overflow-hidden shrink-0 group">
                                        {item.imageUrl ? (
                                            <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">No Image</div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0">
                                            <span className="text-[10px] text-white font-medium">Upload</span>
                                        </div>
                                        <Input 
                                            type="file" 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50" 
                                            onChange={(e) => handleFeaturedItemUpload(e, index)}
                                        />
                                    </div>
                                    
                                    {/* Details */}
                                    <div className="flex-1 grid gap-2 w-full">
                                        <Label>Project Title</Label>
                                        <Input 
                                            value={item.title} 
                                            onChange={(e) => updateFeaturedItem(index, 'title', e.target.value)}
                                            placeholder="e.g. Wedding in Bali"
                                        />
                                    </div>
                                    
                                    {/* Actions */}
                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeFeaturedItem(index)}>
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button onClick={() => saveSection('featured', featuredData)} disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="pricing">
            <Card>
                <CardHeader>
                    <CardTitle>Pricing & Services</CardTitle>
                    <CardDescription>
                        Manage your service packages and pricing tiers.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                     {/* Intro Section */}
                     <div className="space-y-4 border-b pb-6">
                        <h3 className="text-lg font-semibold">Intro</h3>
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label>Section Title</Label>
                                <RichTextEditor 
                                    value={pricingData.intro.title}
                                    onChange={(val) => setPricingData(prev => ({ ...prev, intro: { ...prev.intro, title: val } }))}
                                    className="min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <RichTextEditor 
                                    value={pricingData.intro.description}
                                    onChange={(val) => setPricingData(prev => ({ ...prev, intro: { ...prev.intro, description: val } }))}
                                    className="min-h-[100px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tiers Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Service Packages</h3>
                            <Button variant="outline" size="sm" onClick={addPricingTier}>
                                <Plus className="w-4 h-4 mr-2" /> Add Package
                            </Button>
                        </div>

                        <div className="grid gap-6">
                            {pricingData.tiers.length === 0 && (
                                <p className="text-muted-foreground text-sm italic">No packages yet.</p>
                            )}
                            {pricingData.tiers.map((tier, index) => (
                                <Card key={index} className="bg-muted/10 border-muted">
                                    <CardContent className="p-4 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1 w-full mr-4">
                                                <Label>Package Name</Label>
                                                <Input 
                                                    value={tier.name}
                                                    onChange={(e) => updatePricingTier(index, 'name', e.target.value)}
                                                    placeholder="e.g. Gold"
                                                />
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => removePricingTier(index)}>
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Price / Tagline (Optional)</Label>
                                                <Input 
                                                    value={tier.price}
                                                    onChange={(e) => updatePricingTier(index, 'price', e.target.value)}
                                                    placeholder="e.g. Starting from IDR 5jt"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Icon</Label>
                                                  <Select 
                                                    value={tier.icon} 
                                                    onValueChange={(val) => updatePricingTier(index, 'icon', val)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Icon" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Camera">Camera</SelectItem>
                                                        <SelectItem value="Aperture">Aperture</SelectItem>
                                                        <SelectItem value="Film">Film</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Input 
                                                value={tier.description}
                                                onChange={(e) => updatePricingTier(index, 'description', e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label>Features (One per line)</Label>
                                                <span className="text-xs text-muted-foreground">{tier.features.length} features</span>
                                            </div>
                                            <Textarea 
                                                value={tier.features.join('\n')}
                                                onChange={(e) => updatePricingFeatures(index, e.target.value)}
                                                rows={5}
                                                className="font-mono text-sm"
                                            />
                                        </div>

                                        <div className="flex items-center space-x-2 pt-2">
                                            <Switch 
                                                checked={tier.popular}
                                                onCheckedChange={(checked) => updatePricingTier(index, 'popular', checked)}
                                                id={`popular-${index}`}
                                            />
                                            <Label htmlFor={`popular-${index}`}>Mark as &quot;Most Popular&quot;</Label>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button onClick={() => saveSection('pricing', pricingData)} disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="testimonials">
            <Card>
                <CardHeader>
                    <CardTitle>Testimonials</CardTitle>
                    <CardDescription>
                        Manage client reviews and testimonials.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                     {/* Intro Section */}
                     <div className="space-y-4 border-b pb-6">
                        <h3 className="text-lg font-semibold">Intro</h3>
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label>Section Title</Label>
                                <RichTextEditor 
                                    value={testimonialsData.title}
                                    onChange={(val) => setTestimonialsData(prev => ({ ...prev, title: val }))}
                                    className="min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <RichTextEditor 
                                    value={testimonialsData.description}
                                    onChange={(val) => setTestimonialsData(prev => ({ ...prev, description: val }))}
                                    className="min-h-[100px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Reviews</h3>
                            <Button variant="outline" size="sm" onClick={addTestimonial}>
                                <Plus className="w-4 h-4 mr-2" /> Add Review
                            </Button>
                        </div>

                        <div className="grid gap-6">
                             {testimonialsData.items.length === 0 && (
                                <p className="text-muted-foreground text-sm italic">No reviews yet.</p>
                            )}
                            {testimonialsData.items.map((item, index) => (
                                <div key={item.id} className="flex flex-col md:flex-row gap-6 border p-4 rounded-lg bg-muted/20 items-start">
                                    {/* Image Upload */}
                                     <div className="w-24 h-24 relative bg-muted rounded-full overflow-hidden flex-shrink-0 border-2 border-background shadow-sm group">
                                        {item.src ? (
                                            <Image src={item.src} alt={item.name} fill className="object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-[10px] text-muted-foreground text-center p-1">No Photo</div>
                                        )}
                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0">
                                            <span className="text-[10px] text-white font-medium">Upload</span>
                                        </div>
                                        <Input 
                                            type="file" 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50 rounded-full" 
                                            onChange={(e) => handleTestimonialUpload(e, index)}
                                        />
                                    </div>

                                    <div className="flex-1 space-y-4 w-full">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Client Name</Label>
                                                <Input 
                                                    value={item.name}
                                                    onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Designation / Location</Label>
                                                <Input 
                                                    value={item.designation}
                                                    onChange={(e) => updateTestimonial(index, 'designation', e.target.value)}
                                                    placeholder="e.g. Wedding in Bali"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Quote</Label>
                                            <RichTextEditor 
                                                value={item.quote}
                                                onChange={(val) => updateTestimonial(index, 'quote', val)}
                                                className="min-h-[100px]"
                                            />
                                        </div>
                                    </div>

                                     <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => removeTestimonial(index)}>
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                     </div>

                    <div className="pt-4 flex justify-end">
                        <Button onClick={() => saveSection('testimonials', testimonialsData)} disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="footer">
            <Card>
                <CardHeader>
                    <CardTitle>Footer Section</CardTitle>
                    <CardDescription>
                        Manage branding and social links in the footer.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Brand Name</Label>
                            <RichTextEditor 
                                value={footerData.brandName}
                                onChange={(val) => setFooterData(prev => ({ ...prev, brandName: val }))}
                                className="min-h-[80px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Copyright Text</Label>
                            <RichTextEditor 
                                value={footerData.copyrightText}
                                onChange={(val) => setFooterData(prev => ({ ...prev, copyrightText: val }))}
                                className="min-h-[80px]"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-sm font-medium">Social Links</h3>
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label>Instagram URL</Label>
                                <Input 
                                    value={footerData.instagramLink}
                                    onChange={(e) => setFooterData(prev => ({ ...prev, instagramLink: e.target.value }))}
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>WhatsApp URL</Label>
                                <Input 
                                    value={footerData.whatsappLink}
                                    onChange={(e) => setFooterData(prev => ({ ...prev, whatsappLink: e.target.value }))}
                                    placeholder="https://wa.me/..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button onClick={() => saveSection('footer', footerData)} disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}

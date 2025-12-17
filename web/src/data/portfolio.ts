
export interface ClientProject {
  id: string;
  name: string;
  location: string;
  date: string;
  coverImage: string;
  images: string[];
}

export interface CategoryData {
  id: string;
  title: string;
  description: string;
  projects: ClientProject[];
}

export const portfolioData: CategoryData[] = [
  {
    id: "wedding",
    title: "Wedding Stories",
    description: "Witnessing the union of souls, capturing moments that inevitably become a legacy.",
    projects: [
      {
        id: "arthur-martha",
        name: "Arthur & Martha",
        location: "Bali, Indonesia",
        date: "September 2024",
        coverImage: "https://images.unsplash.com/photo-1542036813441-fc9a620d539d?q=80&w=1171&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1583939411023-14783179e581?q=80&w=1170&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=800",
          "https://images.unsplash.com/photo-1542036813441-fc9a620d539d?q=80&w=1171&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=800",
          "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800",
        ]
      },
      {
        id: "thomas-grace",
        name: "Thomas & Grace",
        location: "Lake Como, Italy",
        date: "August 2024",
        coverImage: "https://images.unsplash.com/photo-1481980235850-66e47651e431?q=80&w=688&auto=format&fit=crop",
        images: [
           "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=800",
           "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800",
           "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800",
           "https://images.unsplash.com/photo-1481980235850-66e47651e431?q=80&w=688&auto=format&fit=crop",
        ]
      },
      {
        id: "luka-elena",
        name: "Luka & Elena",
        location: "Santorini, Greece",
        date: "July 2024",
        coverImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=2070",
        images: [
           "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800",
           "https://images.unsplash.com/photo-1470162415510-8fb54343034b?q=80&w=800",
           "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800",
           "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=2070",
        ]
      }
    ]
  },
  {
    id: "prewedding",
    title: "Pre-Wedding",
    description: "The quiet before the vow. Intimate, candid, and undeniably you.",
    projects: [
      {
        id: "aditya-sarah",
        name: "Aditya & Sarah",
        location: "Bromo, Indonesia",
        date: "October 2024",
        coverImage: "https://images.unsplash.com/photo-1520854221256-17451cc330e7?q=80&w=2070",
        images: [
          "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?q=80&w=800",
          "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800",
          "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800",
           "https://images.unsplash.com/photo-1520854221256-17451cc330e7?q=80&w=2070",
        ]
      }
    ]
  },
  {
    id: "engagement",
    title: "Engagement",
    description: "Capturing the 'Yes' and everything that follows.",
    projects: [
      {
        id: "kai-jennie",
        name: "Kai & Jennie",
        location: "Kyoto, Japan",
        date: "November 2024",
        coverImage: "https://images.unsplash.com/photo-1522413452208-996ff3f3e47a?q=80&w=2070",
        images: [
          "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=800",
          "https://images.unsplash.com/photo-1482575832494-771f74bf6857?q=80&w=800",
          "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800",
           "https://images.unsplash.com/photo-1522413452208-996ff3f3e47a?q=80&w=2070",
        ]
      }
    ]
  }
];

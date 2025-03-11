import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Section, HeroContent } from "@/types/section";

const defaultHeroContent: Section = {
  id: 0,
  name: "hero",
  content: {
    title: "Hi, I'm Aditya Dimri",
    subtitle: "A passionate developer focused on creating impactful digital experiences",
    experience: "3+ Years",
    projects: "20+ Completed",
    overview: "I specialize in modern web development, crafting performant and scalable applications that solve real-world problems.",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
  },
  isPublic: true
};

export default function Hero() {
  const { data: sections, isLoading, error } = useQuery<Section[]>({
    queryKey: ["/api/sections"],
    queryFn: async () => {
      const response = await fetch("/api/sections");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    console.error('Error loading hero section:', error);
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <p>Error loading content. Please try again later.</p>
      </div>
    );
  }

  const heroSection = sections?.find((section) => section.name === "hero") || defaultHeroContent;

  return (
    <section className="relative min-h-[90vh] flex items-center">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1487412840181-f63f62e6a0ee")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15
        }}
      />

      <div className="container relative z-10">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            {heroSection.content.profilePicture && (
              <div className="mb-8">
                <img 
                  src={heroSection.content.profilePicture} 
                  alt="Profile" 
                  className="w-48 h-48 rounded-full object-cover border-4 border-primary shadow-lg"
                />
              </div>
            )}
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4">
              {heroSection.content.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {heroSection.content.subtitle}
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <a href="#projects">
                  View Projects <ChevronRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="#contact">Contact Me</a>
              </Button>
            </div>
          </div>

          <Card className="p-6 bg-card/50 backdrop-blur">
            <h2 className="text-2xl font-bold mb-4">Professional Overview</h2>
            <p className="text-muted-foreground mb-4">
              {heroSection.content.overview}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold">Experience</h3>
                <p className="text-muted-foreground">{heroSection.content.experience}</p>
              </div>
              <div>
                <h3 className="font-bold">Projects</h3>
                <p className="text-muted-foreground">{heroSection.content.projects}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
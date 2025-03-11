import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Projects() {
  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const defaultProjects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with real-time inventory management",
      imageUrl: "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8",
      link: "https://github.com/adimri/ecommerce"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
      link: "https://github.com/adimri/taskmanager"
    },
    {
      id: 3,
      title: "Social Media Dashboard",
      description: "Analytics dashboard for social media performance tracking",
      imageUrl: "https://images.unsplash.com/photo-1739514984003-330f7c1d2007",
      link: "https://github.com/adimri/dashboard"
    }
  ];

  const displayProjects = projects || defaultProjects;

  return (
    <section id="projects" className="py-20">
      <div className="container">
        <h2 className="text-3xl font-bold mb-12 text-center font-heading">Featured Projects</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project) => (
            <Card key={project.id} className="group">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex gap-4">
                  {project.link && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        Code
                      </a>
                    </Button>
                  )}
                  <Button size="sm" asChild>
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

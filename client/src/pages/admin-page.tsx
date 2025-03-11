import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Section, Project } from "@shared/schema";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Save, Plus } from "lucide-react";
import { Link } from "wouter";
import { toast } from "@/hooks/use-toast";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  link: z.string().url("Must be a valid URL").optional(),
  order: z.number().optional(),
});

const sectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  content: z.string().min(1, "Content is required"),
  isPublic: z.boolean().default(true),
});

const heroContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  experience: z.string().min(1, "Experience is required"),
  projects: z.string().min(1, "Projects count is required"),
  overview: z.string().min(1, "Overview is required"),
  profilePicture: z.string().url("Must be a valid URL").optional(),
});

const validateJSON = (jsonString: string) => {
  try {
    return {
      valid: true,
      parsed: JSON.parse(jsonString)
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON'
    };
  }
};

export default function AdminPage() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("content");
  const [editingSection, setEditingSection] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<number | null>(null);

  const { data: sections } = useQuery<Section[]>({
    queryKey: ["/api/sections"],
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const createProject = useMutation({
    mutationFn: async (data: z.infer<typeof projectSchema>) => {
      const res = await apiRequest("POST", "/api/projects", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      projectForm.reset();
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof projectSchema> }) => {
      const res = await apiRequest("PATCH", `/api/projects/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setEditingProject(null);
    },
  });

  const createSection = useMutation({
    mutationFn: async (data: z.infer<typeof sectionSchema>) => {
      const res = await apiRequest("POST", "/api/sections", {
        ...data,
        content: JSON.parse(data.content),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sections"] });
      sectionForm.reset();
    },
  });

  const updateSection = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof sectionSchema> }) => {
      const res = await apiRequest("PATCH", `/api/sections/${id}`, {
        ...data,
        content: JSON.parse(data.content),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sections"] });
      setEditingSection(null);
    },
  });

  const projectForm = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      link: "",
    },
  });

  const sectionForm = useForm({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      name: "",
      content: "",
      isPublic: true,
    },
  });

  const startEditingSection = (section: Section) => {
    setEditingSection(section.id);
    sectionForm.reset({
      name: section.name,
      content: JSON.stringify(section.content, null, 2),
      isPublic: section.isPublic,
    });
  };

  const startEditingProject = (project: Project) => {
    setEditingProject(project.id);
    projectForm.reset({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      link: project.link || "",
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.username}</h1>
            <p className="text-muted-foreground">Manage your portfolio content here</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="outline" onClick={() => logoutMutation.mutate()}>
              Logout
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Website Content</CardTitle>
                <CardDescription>Edit the content for different sections of your website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {sections?.map((section) => (
                    <Card key={section.id} className="relative">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl">{section.name}</CardTitle>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => startEditingSection(section)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {editingSection === section.id ? (
                          <Form {...sectionForm}>
                            <form onSubmit={sectionForm.handleSubmit((data) => {
                              const result = validateJSON(data.content);
                              
                              if (!result.valid) {
                                toast({
                                  title: "Invalid JSON",
                                  description: "Please check your JSON format. Common issues include:\n- Missing quotes around property names\n- Trailing commas\n- Invalid control characters",
                                  variant: "destructive"
                                });
                                return;
                              }
                            
                              if (section.name === "hero") {
                                try {
                                  // Validate hero content structure
                                  const heroContent = result.parsed;
                                  const requiredFields = ['title', 'subtitle', 'experience', 'projects', 'overview'];
                                  const missingFields = requiredFields.filter(field => !heroContent[field]);
                                  
                                  if (missingFields.length > 0) {
                                    toast({
                                      title: "Invalid Hero Content",
                                      description: `Missing required fields: ${missingFields.join(', ')}`,
                                      variant: "destructive"
                                    });
                                    return;
                                  }
                            
                                  updateSection.mutate({
                                    id: section.id,
                                    data: {
                                      ...data,
                                      content: {
                                        ...heroContent,
                                        profilePicture: heroContent.profilePicture || undefined
                                      }
                                    }
                                  });
                                } catch (error) {
                                  toast({
                                    title: "Error",
                                    description: "Failed to update section",
                                    variant: "destructive"
                                  });
                                }
                              }
                            })} className="space-y-4">
                              <FormField
                                control={sectionForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Section Name</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={sectionForm.control}
                                name="content"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Content (JSON)</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} rows={10} className="font-mono" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              {section.name === "hero" && (
                                <FormField
                                  control={sectionForm.control}
                                  name="content.profilePicture"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Profile Picture URL</FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder="https://example.com/profile.jpg"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                              <div className="flex gap-2">
                                <Button type="submit" disabled={updateSection.isPending}>
                                  <Save className="mr-2 h-4 w-4" />
                                  Save Changes
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setEditingSection(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          </Form>
                        ) : (
                          <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96">
                            {JSON.stringify(section.content, null, 2)}
                          </pre>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Add or edit your portfolio projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <Button
                    onClick={() => {
                      setEditingProject(null);
                      projectForm.reset({
                        title: "",
                        description: "",
                        imageUrl: "",
                        link: "",
                      });
                    }}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Project
                  </Button>

                  {!editingProject && (
                    <Form {...projectForm}>
                      <form onSubmit={projectForm.handleSubmit((data) => createProject.mutate(data))} className="space-y-4">
                        <FormField
                          control={projectForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={projectForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={projectForm.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={projectForm.control}
                          name="link"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Link (Optional)</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={createProject.isPending}>
                          {createProject.isPending ? "Creating..." : "Create Project"}
                        </Button>
                      </form>
                    </Form>
                  )}

                  {projects?.map((project) => (
                    <Card key={project.id}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>{project.title}</CardTitle>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => startEditingProject(project)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      {editingProject === project.id ? (
                        <CardContent>
                          <Form {...projectForm}>
                            <form onSubmit={projectForm.handleSubmit((data) => updateProject.mutate({ id: project.id, data }))} className="space-y-4">
                              <FormField
                                control={projectForm.control}
                                name="title"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={projectForm.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={projectForm.control}
                                name="imageUrl"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={projectForm.control}
                                name="link"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Project Link (Optional)</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="flex gap-2">
                                <Button type="submit" disabled={updateProject.isPending}>
                                  <Save className="mr-2 h-4 w-4" />
                                  Save Changes
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setEditingProject(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </CardContent>
                      ) : (
                        <CardContent>
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                          <p className="text-muted-foreground">{project.description}</p>
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline mt-2 inline-block"
                            >
                              View Project
                            </a>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
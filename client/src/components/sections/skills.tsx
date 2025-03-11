import { Card, CardContent } from "@/components/ui/card";
import { SiReact, SiTypescript, SiNodedotjs, SiPostgresql, SiAmazon, SiDocker } from "react-icons/si";

const skillCategories = [
  {
    title: "Frontend Development",
    skills: [
      { name: "React", icon: SiReact, level: 90 },
      { name: "TypeScript", icon: SiTypescript, level: 85 },
      { name: "Responsive Design", level: 95 },
      { name: "State Management", level: 88 }
    ]
  },
  {
    title: "Backend Development",
    skills: [
      { name: "Node.js", icon: SiNodedotjs, level: 88 },
      { name: "PostgreSQL", icon: SiPostgresql, level: 82 },
      { name: "RESTful APIs", level: 90 },
      { name: "GraphQL", level: 75 }
    ]
  },
  {
    title: "DevOps & Tools",
    skills: [
      { name: "AWS", icon: SiAmazon, level: 80 },
      { name: "Docker", icon: SiDocker, level: 85 },
      { name: "CI/CD", level: 78 },
      { name: "Git", level: 92 }
    ]
  }
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-muted/50">
      <div className="container">
        <h2 className="text-3xl font-bold mb-12 text-center font-heading">Skills & Expertise</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category) => (
            <Card key={category.title}>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-6">{category.title}</h3>
                <div className="space-y-6">
                  {category.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {skill.icon && <skill.icon className="h-5 w-5" />}
                          <span className="font-medium">{skill.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
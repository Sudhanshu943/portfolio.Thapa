import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Rocket, Users, Globe } from "lucide-react";

const goals = [
  {
    icon: Target,
    title: "Technical Excellence",
    description: "Continuously expanding expertise in emerging technologies and best practices to deliver cutting-edge solutions."
  },
  {
    icon: Users,
    title: "Community Impact",
    description: "Contributing to open-source projects and mentoring aspiring developers to give back to the tech community."
  },
  {
    icon: Rocket,
    title: "Innovation",
    description: "Building innovative solutions that solve real-world problems and improve user experiences."
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Creating applications that reach and positively impact users worldwide."
  }
];

export default function Goals() {
  return (
    <section id="goals" className="py-20">
      <div className="container">
        <h2 className="text-3xl font-bold mb-12 text-center font-heading">Future Goals</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {goals.map((goal) => (
            <Card key={goal.title} className="bg-card hover:bg-accent transition-colors">
              <CardHeader>
                <goal.icon className="h-10 w-10 mb-4 text-primary" />
                <CardTitle className="text-xl">{goal.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{goal.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-12">
          <CardContent className="p-8">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4">Vision Statement</h3>
              <p className="text-lg text-muted-foreground">
                "My goal is to become a leading force in software development, 
                creating innovative solutions that make a meaningful difference 
                in people's lives while inspiring the next generation of developers."
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

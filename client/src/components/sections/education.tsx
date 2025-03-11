import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Clock, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Section } from "@shared/schema";

export default function Education() {
  const { data: sections } = useQuery<Section[]>({
    queryKey: ["/api/sections"],
  });

  const educationSection = sections?.find(section => section.name === "education") || {
    content: {
      degree: "B.Tech in Computer Science & Engineering",
      period: "2022-2026",
      institution: "Graphic Era Hill University",
      achievements: [
        "🔹 Haptic Hearing System – Developing for a hackathon",
        "🔹 Cursor Controller Using Webcam – Built a system to control the cursor with hand gestures",
        "🔹 Social Media Website – Created during diploma, a complete social networking platform"
      ]
    }
  };

  return (
    <section id="education" className="py-20 bg-muted/50">
      <div className="container">
        <h2 className="text-3xl font-bold mb-12 text-center font-heading">Education</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <GraduationCap className="h-8 w-8" />
                <div>
                  <CardTitle>{educationSection.content.degree}</CardTitle>
                  <p className="text-muted-foreground">{educationSection.content.institution}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{educationSection.content.period}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Award className="h-8 w-8" />
                <div>
                  <CardTitle>Projects & Achievements</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {educationSection.content.achievements.map((achievement, index) => (
                  <li key={index} className="text-muted-foreground">
                    {achievement}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Hero from "@/components/sections/hero";
import Education from "@/components/sections/education";
import Projects from "@/components/sections/projects";
import Skills from "@/components/sections/skills";
import Goals from "@/components/sections/goals";
import Contact from "@/components/sections/contact";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Education />
        <Projects />
        <Skills />
        <Goals />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

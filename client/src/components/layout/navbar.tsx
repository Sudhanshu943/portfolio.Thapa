import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Navbar() {
  const { user } = useAuth();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Aditya Dimri
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6">
            <button onClick={() => scrollToSection('education')} className="hover:text-primary">Education</button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-primary">Projects</button>
            <button onClick={() => scrollToSection('skills')} className="hover:text-primary">Skills</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-primary">Contact</button>
            <ThemeSwitcher />
            {user ? (
              <Button variant="outline" asChild>
                <Link href="/admin">Admin</Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/auth">Login</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
}
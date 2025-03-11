export interface HeroContent {
  title: string;
  subtitle: string;
  experience: string;
  projects: string;
  overview: string;
  profilePicture?: string;
}

export interface Section {
  id: number;
  name: string;
  content: HeroContent;
  isPublic: boolean;
}
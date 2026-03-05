export interface Contributor {
  name: string;
  role: string;
  avatar?: string;
  link?: string;
}

export interface Acknowledgment {
  name: string;
  description: string;
  link?: string;
}

export const CONTRIBUTORS: Contributor[] = [
  {
    name: "Roy-Jin",
    role: "Lead Developer",
    avatar: "https://rj-cloud.pages.dev/avatar.png",
    link: "https://github.com/Roy-Jin"
  },
  // ... some contributors
];

export const ACKNOWLEDGMENTS: Acknowledgment[] = [
  {
    name: "contributors",
    description: "Thanks to all contributors for their hard work and dedication to the project.",
    link: "#"
  },
  // ... some contributors
];

export const contributorsByRole = CONTRIBUTORS.reduce((acc, contributor) => {
  if (!acc[contributor.role]) {
    acc[contributor.role] = [];
  }
  acc[contributor.role].push(contributor);
  return acc;
}, {} as Record<string, Contributor[]>);

export type LinkKind = 'github' | 'linkedin' | 'blog' | 'projects' | 'contact'
export interface ProfileLink { kind: LinkKind; title: string; description: string; href: string }
// Sample identity from the reference. Replace public example destinations before publishing.
export const profile = {
  name: 'Ed James', tagline: 'Developer | Cybersecurity Enthusiast',
  introduction: 'Building secure systems and exploring the digital world.',
  avatar: '/images/hooded-avatar.png', footer: 'Secure today, build tomorrow.',
}
export const profileLinks: ProfileLink[] = [
  { kind: 'github', title: 'GitHub', description: 'My code & projects', href: 'https://github.com/EDProgrammerist' },
  { kind: 'linkedin', title: 'LinkedIn', description: "Let's connect", href: 'https://www.linkedin.com' },
  { kind: 'blog', title: 'Facebook', description: 'Tech, Security and More', href: 'https://www.facebook.com/Ejgoist/' },
  { kind: 'projects', title: 'My Projects', description: "Things I’ve built", href: 'https://github.com/EDProgrammerist?tab=repositories' },
  { kind: 'contact', title: 'Contact Me', description: "Let's work together", href: 'mailto:paristonnn@gmail.com?subject=Let%27s%20work%20together' },
]

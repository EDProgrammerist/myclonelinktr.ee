import { TerminalBackground } from '@/components/features/link-hub/terminal-background'
import { BootTerminal, ProfileHeader, LinkList, TerminalFooter } from '@/components/features/link-hub/link-hub'

export function HomePage() {
  return <main className="hub relative isolate mx-auto overflow-hidden">
    <a href="#links" className="skip-link">Skip to links</a>
    <TerminalBackground />
    <div className="hub-content relative z-10 mx-auto">
      <div className="hero relative"><BootTerminal /><ProfileHeader /></div>
      <LinkList /><TerminalFooter />
    </div>
  </main>
}

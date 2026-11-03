import { ChevronRight, Terminal } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useReducedMotion } from '@/lib/use-reduced-motion'
import DecryptedText from './decrypted-text'
import { ThemeSwitcher } from './theme-switcher'
import { profile, profileLinks, type LinkKind, type ProfileLink } from '@/lib/profile'

export function BootTerminal() {
  const reduced = useReducedMotion()
  const message = '>> developer\n>> cybersecurity\n>> always learning'
  const [count, setCount] = useState(0)
  const done = reduced || count >= message.length
  useEffect(() => {
    if (reduced || done) return
    const timer = window.setInterval(() => setCount(value => Math.min(value + 1, message.length)), 35)
    return () => window.clearInterval(timer)
  }, [reduced, done, message.length])
  return <aside className="boot-terminal" aria-label="Profile terminal">
    <ThemeSwitcher />
    <div className="terminal-prompt">root@portfolio:~$ <span className="online" aria-label="Online" /></div>
    <div>whoami</div><div className="boot-lines" aria-hidden="true">{done ? message : message.slice(0, count)}</div>
    <span className="sr-only">Developer, cybersecurity, always learning.</span>
    <div className="terminal-prompt">root@portfolio:~$ <span className="cursor">_</span></div>
    <span className="terminal-dash" aria-hidden="true">_</span>
    {!done && <button type="button" className="skip-boot" onClick={() => setCount(message.length)}>Skip</button>}
  </aside>
}
export function ProfileHeader() {
  const reduced = useReducedMotion()
  return <header className="profile text-center">
    <div className="avatar-ring mx-auto"><img src={profile.avatar} alt="Anonymous hooded figure illuminated in green" width="120" height="120" /></div>
    <h1>{reduced ? profile.name : <DecryptedText text={profile.name} animateOn="view" speed={45} maxIterations={12} />}</h1><p className="tagline">{profile.tagline}</p><p className="introduction">{profile.introduction}</p>
  </header>
}
function LinkIcon({ kind }: { kind: LinkKind }) {
  if (kind === 'github') return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.28-5.12-1.25-5.12-5.54 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.07-1.15 3.07-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.3-2.63 5.25-5.14 5.53.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.78.54A11.2 11.2 0 0 0 12 .8Z" /></svg>
  if (kind === 'linkedin') return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect width="22" height="22" x="1" y="1" rx="3" /><path fill="var(--surface)" d="M5 9h3v10H5zm1.5-4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2ZM10 9h3v1.4c.6-1 1.6-1.6 3-1.6 3 0 3.4 2 3.4 4.6V19h-3v-5c0-1.3 0-2.5-1.6-2.5S13 12.7 13 14v5h-3Z" /></svg>
  if (kind === 'blog') return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 1h10l5 5v15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2Z" /><path d="M15 1v6h5M7 11h9M7 15h9M7 19h9" fill="none" stroke="var(--surface)" strokeWidth="1.5" /></svg>
  if (kind === 'projects') return <Terminal strokeWidth={3} />
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="3" width="22" height="19" rx="4" fill="currentColor" /><path d="m2 6 10 8L22 6" fill="none" stroke="var(--surface)" strokeWidth="1.5" /></svg>
}
function LinkCard({ link, index }: { link: ProfileLink; index: number }) {
  const [touchPressed, setTouchPressed] = useState(false)
  const reduced = useReducedMotion()
  const external = link.href.startsWith('https:')
  return <motion.a data-touch-pressed={touchPressed || undefined} onTapStart={event => { if ('pointerType' in event && event.pointerType === 'touch') setTouchPressed(true) }} onTap={() => setTouchPressed(false)} onTapCancel={() => setTouchPressed(false)} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .35, delay: reduced ? 0 : index * .08 }} whileHover={reduced ? undefined : { y: -2, transition: { duration: .18 } }} whileTap={reduced ? undefined : { y: 0, scale: .99 }} className="link-card flex items-center" href={link.href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
    <span className="link-icon shrink-0"><LinkIcon kind={link.kind} /></span>
    <span className="link-copy min-w-0"><span className="link-title block">{link.title}</span><span className="link-description block">{link.description}</span></span>
    <ChevronRight className="link-arrow ml-auto shrink-0" size={17} strokeWidth={1.5} aria-hidden="true" />
    {external && <span className="sr-only"> (opens in a new tab)</span>}
  </motion.a>
}
export function LinkList() {
  return <nav id="links" aria-label="Ed James’s links" className="link-list flex flex-col">{profileLinks.map((link, index) => <LinkCard key={link.kind} link={link} index={index} />)}</nav>
}
export function TerminalFooter() {
  return <footer className="terminal-footer flex items-center"><span aria-hidden="true">&gt;</span><p>{profile.footer}</p><span className="block-cursor" aria-hidden="true" /></footer>
}

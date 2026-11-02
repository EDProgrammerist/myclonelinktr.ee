export function TerminalBackground() {
  return <div className="terminal-background pointer-events-none absolute inset-0" aria-hidden="true">
    <img className="cyber-map" src="/images/world-map.svg" alt="" />
    <div className="circuit-grid" />
    <div className="side-code">{Array.from({length: 14}, (_, i) => <div key={i}>{['010 10110', 'SYS.READY', '0x00FF88', 'NET.SECURE'][i % 4]}</div>)}</div>
    <div className="scanlines" /><div className="frame-corners" />
  </div>
}

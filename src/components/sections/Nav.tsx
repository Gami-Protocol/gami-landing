import { GamiMark } from '../ui/Icons';
import { Button } from '../ui/Primitives';
import { links } from '../../lib/links';

const items = [
  ['#how', 'How it works'],
  ['#wallet', 'Wallet'],
  ['#extension', 'Extension'],
  ['#quests', 'Quests'],
  ['#companies', 'For companies'],
  ['#ramp', 'XP economics'],
  ['#settlement', 'Settlement'],
] as const;

export function Nav() {
  return (
    <header className="nav">
      <div className="wrap">
        <a className="brand" href="#top"><GamiMark className="mark" />GAMI</a>
        <nav className="navlinks" aria-label="Sections">
          {items.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <div className="navcta">
          <a className="quiet" href={links.chromeStore} {...(links.chromeStore.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>Add to Chrome</a>
          <Button size="sm" href="#cta">Get the wallet</Button>
        </div>
      </div>
    </header>
  );
}

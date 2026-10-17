import { GamiMark } from '../ui/Icons';
import { Button } from '../ui/Primitives';
import { links } from '../../lib/links';
import { isRaiseHost, mainHref, raiseHref } from '../../lib/site';

const mainItems = (): Array<[string, string]> => [
  ['/#how', 'How it works'],
  ['/#wallet', 'Wallet'],
  ['/#extension', 'Extension'],
  ['/#quests', 'Quests'],
  ['/#companies', 'For companies'],
  ['/#ramp', 'XP economics'],
  [raiseHref(), 'Raise'],
  ['/partners', 'Partners'],
];

/** On the raise subdomain the nav is the raise page's own sections plus a way back to the main site. */
const raiseItems = (): Array<[string, string]> => [
  ['#tiers', 'Tiers'],
  ['#reserve', 'Reserve'],
  ['#liquidity', 'Liquidity'],
  [mainHref('/partners'), 'Partners'],
  [mainHref('/'), 'Main site'],
];

export function Nav() {
  const onRaise = isRaiseHost();
  const items = onRaise ? raiseItems() : mainItems();
  return (
    <header className="nav">
      <div className="wrap">
        <a className="brand" href={mainHref('/')}><GamiMark className="mark" />GAMI</a>
        <nav className="navlinks" aria-label="Sections">
          {items.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <div className="navcta">
          <a className="quiet" href={links.chromeStore} {...(links.chromeStore.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>Add to Chrome</a>
          <Button size="sm" href={mainHref('/#cta')}>Get the wallet</Button>
        </div>
      </div>
    </header>
  );
}

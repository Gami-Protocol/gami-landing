import { GamiMark } from '../ui/Icons';
import { links } from '../../lib/links';
import { mainHref, raiseHref } from '../../lib/site';

type Col = [string, Array<[string, string]>];

const rawCols = (): Col[] => [
  ['Products', [['/#wallet', 'Wallet'], ['/#extension', 'Chrome extension'], ['/#how', 'Card rewards'], ['/#quests', 'Quests and games'], ['/#ramp', 'XP economics']]],
  ['Developers', [['/partners', 'List your project'], ['/#companies', 'MCP server'], ['/#companies', 'Agentic web tool'], [links.docs, 'Documentation']]],
  ['Protocol', [['/#settlement', 'Settlement'], [raiseHref(), 'Token raise'], ['/#', 'Privacy'], ['/#', 'Terms']]],
];

/** Paths belong to the main site, so from the raise subdomain they need its origin. */
const cols = (): Col[] => rawCols().map(([title, items]): Col => [title, items.map(([href, label]): [string, string] => [href.startsWith('/') ? mainHref(href) : href, label])]);

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="fgrid">
          <div>
            <div className="brand" style={{ fontSize: 24 }}>
              <GamiMark className="mark" style={{ width: 32, height: 32 }} />GAMI PROTOCOL
            </div>
            <p className="blurb">One SDK, one MCP server. XP, quests, missions and stablecoin-settled rewards for any app, game, card or store.</p>
          </div>
          {cols().map(([title, items]) => (
            <div key={title}>
              <h4>{title}</h4>
              <ul>{items.map(([href, label]) => <li key={label}><a href={href}>{label}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="fbot">
          <span className="st">● NETWORK LIVE · BASE 8453</span>
          <span>BUILD 0.2.7 · © {new Date().getFullYear()} GAMI PROTOCOL LTD</span>
        </div>
      </div>
    </footer>
  );
}

import { GamiMark } from '../ui/Icons';
import { links } from '../../lib/links';

const cols: Array<[string, Array<[string, string]>]> = [
  ['Products', [['#wallet', 'Wallet'], ['#extension', 'Chrome extension'], ['#how', 'Card rewards'], ['#quests', 'Quests and games'], ['#ramp', 'XP economics']]],
  ['Developers', [['#companies', 'MCP server'], ['#companies', 'Agentic web tool'], [links.docs, 'Documentation'], ['#companies', 'SDK']]],
  ['Protocol', [['#settlement', 'Settlement'], ['#ramp', 'Token'], ['#', 'Privacy'], ['#', 'Terms']]],
];

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
          {cols.map(([title, items]) => (
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

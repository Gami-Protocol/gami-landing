import { Hexagon, Icon } from '../ui/Icons';
import { Button, SectionHead } from '../ui/Primitives';
import { links } from '../../lib/links';
import { SidePanelMock } from '../mocks/SidePanelMock';

const features = [
  { icon: Icon.Clock, title: 'Quests on the current site', body: 'Open the popup on a partner store and see the live quest, your progress and the XP on offer.' },
  { icon: Icon.Star, title: 'NOVA', body: 'Ask what a payment earned, when you reach the next level, or what the conversion rate is right now.' },
  { icon: Icon.Grid, title: 'Rewards', body: 'USDC on Base and Solana read directly from public RPCs. Works even when the Gami API is unreachable.' },
  { icon: Icon.Lock, title: 'Passkey in the side panel', body: 'Add a passkey from Settings. Prompts run in the panel so Chrome does not close them mid-way.' },
];

export function Extension() {
  return (
    <section className="sec band" id="extension">
      <div className="wrap">
        <SectionHead
          eyebrow="CHROME EXTENSION · SIDE PANEL"
          title="The wallet, on the site you are already on"
          intro="The extension reads the quest for the current site, tracks your card spend there and lets NOVA answer questions about your XP. Same Privy account, same Base wallet as the app."
        />
        <div className="pgcta" style={{ marginTop: 32 }}>
          <Button href={links.chromeStore}>Add to Chrome</Button>
        </div>
        <div className="prod rev">
          <div className="feat">
            {features.map((f) => (
              <div key={f.title}><f.icon /><div><b>{f.title}</b><p>{f.body}</p></div></div>
            ))}
          </div>
          <div className="art">
            <Hexagon className="ghex" />
            <SidePanelMock />
          </div>
        </div>
      </div>
    </section>
  );
}

import { Button, Eyebrow } from '../ui/Primitives';
import { links } from '../../lib/links';
import { raiseHref } from '../../lib/site';

export function Cta() {
  return (
    <section className="ctab" id="cta">
      <div className="wrap in">
        <div>
          <Eyebrow style={{ color: '#fff' }}>START EARNING</Eyebrow>
          <h2 style={{ marginTop: 12 }}>Every payment. Every chain. One wallet.</h2>
          <p>Get the wallet on iOS or Android, add the extension to Chrome, link a card or pick a mission. Your first verified action mints XP.</p>
        </div>
        <div>
          <div className="btns">
            <Button variant="ink" size="lg" href={links.appStore}>Get the wallet</Button>
            <Button variant="outline" size="lg" href={links.chromeStore} style={{ borderColor: '#000', color: '#000' }}>Add to Chrome</Button>
          </div>
          <small>
            Card provisioning rolls out with issuing partners. XP, quests and missions work today. Studios and companies:{' '}
            <a href="/partners" style={{ textDecoration: 'underline' }}>list your project</a> or read the{' '}
            <a href={links.docs} style={{ textDecoration: 'underline' }}>docs</a>. Buying the token:{' '}
            <a href={raiseHref()} style={{ textDecoration: 'underline' }}>see the raise</a>.
          </small>
        </div>
      </div>
    </section>
  );
}

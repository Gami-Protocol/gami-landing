import { useMemo, useState } from 'react';
import { Button, Eyebrow, SectionHead, TrustBadge } from '../components/ui/Primitives';
import { links } from '../lib/links';
import {
  ASSETS,
  CATEGORIES,
  EMPTY_PARTNER,
  buildManifest,
  manifestJson,
  mcpSnippet,
  validatePartner,
  webMcpSnippet,
  type Category,
  type PartnerInput,
  type RewardAsset,
} from '../lib/partners';

const routes = [
  ['MCP plugin', 'Connect the Gami MCP server from Claude, Cursor or any MCP client. Your agent calls gami_partner_submit with the manifest and gets back a pending listing and a verification step.'],
  ['Agentic web tool', 'Register a WebMCP tool on your own site. A browsing agent can check your listing and quest status from the page, and the registry only trusts what is signed by your origin.'],
  ['Manifest only', 'Publish /.well-known/gami.json yourself and submit the URL. No SDK, no agent. The registry fetches it and verifies it against your origin.'],
] as const;

const levels = [
  ['unverified', 'Submitted', 'Listed as pending. Quests can run in a sandbox with no payouts.'],
  ['attested', 'Origin matches', 'The registry fetched your manifest from your own origin and the fields agree. XP quests go live.'],
  ['verified', 'Reviewed', 'A human review of your rules and pool. USDC rewards and the partner directory listing.'],
] as const;

type Tab = 'manifest' | 'mcp' | 'webmcp';
type Sent = 'idle' | 'sending' | 'sent' | 'error';

export function Partners() {
  return (
    <main id="top">
      <section className="pghead hexbg">
        <div className="wrap pgrid one">
          <div>
            <Eyebrow>PARTNERS · MCP + AGENTIC WEB TOOL</Eyebrow>
            <h1>List your platform. Let an agent do it.</h1>
            <p className="intro">
              Add your site, game or store to the Gami registry from your editor, your agent or one JSON file. You describe the reward once, it is
              checked against your own origin, and your quests show up in the wallet and the extension.
            </p>
            <div className="pgcta">
              <Button size="lg" href="#register">Build your listing</Button>
              <Button size="lg" variant="outline" href="/#companies">How the MCP server works</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="sec band">
        <div className="wrap">
          <SectionHead eyebrow="THREE WAYS IN" title="Pick how you connect" intro="All three produce the same manifest and the same listing." size="md" />
          <div className="routes">
            {routes.map(([t, b], i) => (
              <div className="cd" key={t}>
                <small>0{i + 1}</small>
                <h3>{t}</h3>
                <p>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Register />

      <section className="sec band">
        <div className="wrap">
          <SectionHead
            eyebrow="TRUST LEVELS"
            title="Listed does not mean trusted"
            intro="A listing earns trust in steps, and only the origin you control can move it up. A scraped page or a claim in a chat never does."
            size="md"
          />
          <div className="routes">
            {levels.map(([level, t, b]) => (
              <div className="cd" key={level}>
                <TrustBadge level={level}>{level}</TrustBadge>
                <h3 style={{ marginTop: 12 }}>{t}</h3>
                <p>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <SectionHead eyebrow="DIRECTORY" title="First partners land here" intro="No one is listed yet. Verified partners will appear with their category, rewards and trust level." size="md" />
          <div className="empty cd">
            <p>Be one of the first. Your listing takes a few minutes to build above.</p>
            <Button variant="outline" href="#register">Build your listing</Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Register() {
  const [form, setForm] = useState<PartnerInput>(EMPTY_PARTNER);
  const [touched, setTouched] = useState(false);
  const [tab, setTab] = useState<Tab>('manifest');
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState<Sent>('idle');

  const errors = useMemo(() => validatePartner(form), [form]);
  const valid = Object.keys(errors).length === 0;
  const manifest = useMemo(() => (valid ? buildManifest(form) : null), [form, valid]);

  const text = manifest
    ? { manifest: manifestJson(manifest), mcp: mcpSnippet(manifest), webmcp: webMcpSnippet(manifest) }[tab]
    : '// Fill in the form. The manifest appears here once every field is valid.';

  const set = <K extends keyof PartnerInput>(key: K, value: PartnerInput[K]) => setForm((f) => ({ ...f, [key]: value }));
  const err = (k: keyof PartnerInput) => (touched ? errors[k] : undefined);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked: the text is selectable in the panel */
    }
  }

  function download() {
    if (!manifest) return;
    const url = URL.createObjectURL(new Blob([manifestJson(manifest)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gami.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function submit() {
    setTouched(true);
    if (!manifest) return;
    if (!links.partnersApi) {
      window.location.href = `mailto:${links.contact}?subject=${encodeURIComponent(`Partner listing: ${manifest.name}`)}&body=${encodeURIComponent(manifestJson(manifest))}`;
      return;
    }
    setSent('sending');
    try {
      const res = await fetch(links.partnersApi, { method: 'POST', headers: { 'content-type': 'application/json' }, body: manifestJson(manifest) });
      setSent(res.ok ? 'sent' : 'error');
    } catch {
      setSent('error');
    }
  }

  return (
    <section className="sec" id="register">
      <div className="wrap">
        <SectionHead
          eyebrow="BUILD YOUR LISTING"
          title="One form, three outputs"
          intro="Fill this in and copy the manifest, the MCP call or the WebMCP tool. Nothing leaves your browser until you submit."
          size="md"
        />
        <div className="reg">
          <form className="cd" noValidate onSubmit={(e) => { e.preventDefault(); void submit(); }}>
            <Field label="Project name" id="p-name" error={err('name')}>
              <input id="p-name" className="inp" value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="organization" />
            </Field>
            <Field label="Site origin" id="p-origin" error={err('origin')} hint="Where you will publish /.well-known/gami.json.">
              <input id="p-origin" className="inp" value={form.origin} placeholder="https://yourgame.com" onChange={(e) => set('origin', e.target.value)} autoComplete="url" />
            </Field>
            <div className="two">
              <Field label="Category" id="p-cat">
                <select id="p-cat" className="inp" value={form.category} onChange={(e) => set('category', e.target.value as Category)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Contact email" id="p-contact" error={err('contact')}>
                <input id="p-contact" className="inp" type="email" value={form.contact} onChange={(e) => set('contact', e.target.value)} autoComplete="email" />
              </Field>
            </div>
            <Field label="What it is" id="p-desc" error={err('description')} hint={`${form.description.trim().length}/280`}>
              <textarea id="p-desc" className="inp" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
            </Field>
            <div className="two">
              <Field label="Quest trigger" id="p-trig" error={err('trigger')}>
                <input id="p-trig" className="inp mono" value={form.trigger} onChange={(e) => set('trigger', e.target.value)} spellCheck={false} />
              </Field>
              <Field label="XP per completion" id="p-xp" error={err('xp')}>
                <input id="p-xp" className="inp" inputMode="numeric" value={form.xp} onChange={(e) => set('xp', e.target.value)} />
              </Field>
            </div>
            <div className="two">
              <Field label="Reward" id="p-asset">
                <select id="p-asset" className="inp" value={form.asset} onChange={(e) => set('asset', e.target.value as RewardAsset)}>
                  {ASSETS.map((a) => <option key={a}>{a}</option>)}
                </select>
              </Field>
              {form.asset === 'USDC' ? (
                <Field label="USDC pool" id="p-pool" error={err('poolUsdc')}>
                  <input id="p-pool" className="inp" inputMode="decimal" value={form.poolUsdc} onChange={(e) => set('poolUsdc', e.target.value)} />
                </Field>
              ) : <div />}
            </div>
            <label className="chk">
              <input type="checkbox" checked={form.webAgent} onChange={(e) => set('webAgent', e.target.checked)} />
              Let the Gami web agent detect quests on my site. Detection never credits XP; only a result signed by my origin does.
            </label>
          </form>

          <div className="term">
            <div className="tb">
              <span className="tabs" role="tablist" aria-label="Output">
                {([['manifest', 'gami.json'], ['mcp', 'MCP'], ['webmcp', 'WebMCP']] as const).map(([id, label]) => (
                  <button key={id} role="tab" type="button" aria-selected={tab === id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{label}</button>
                ))}
              </span>
              <span>{valid ? 'ready' : 'incomplete'}</span>
            </div>
            <pre tabIndex={0}>{text}</pre>
            <div className="acts">
              <button type="button" className="btn sm outline" onClick={copy} disabled={!manifest}>{copied ? 'Copied' : 'Copy'}</button>
              <button type="button" className="btn sm outline" onClick={download} disabled={!manifest}>Download gami.json</button>
              <button type="button" className="btn sm" onClick={() => void submit()} disabled={sent === 'sending' || sent === 'sent'}>
                {sent === 'sending' ? 'Sending' : sent === 'sent' ? 'Submitted' : links.partnersApi ? 'Submit listing' : 'Email listing'}
              </button>
            </div>
            <p className="msg" role="status">
              {sent === 'sent' && 'Received. Publish the manifest at your origin to move from unverified to attested.'}
              {sent === 'error' && 'Could not reach the registry. Copy the manifest and try again.'}
              {sent === 'idle' && touched && !valid && 'Fix the highlighted fields first.'}
              {sent === 'idle' && !links.partnersApi && valid && `The registry endpoint is not live yet, so this opens an email to ${links.contact}.`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, id, error, hint, children }: { label: string; id: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label className="fld" htmlFor={id}>{label}</label>
      {children}
      {error ? <p className="err" id={`${id}-e`}>{error}</p> : hint ? <p className="note">{hint}</p> : null}
    </div>
  );
}

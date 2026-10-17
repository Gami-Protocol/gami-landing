import { useEffect } from 'react';
import { SvgDefs } from './components/ui/Icons';
import { Nav } from './components/sections/Nav';
import { Hero } from './components/sections/Hero';
import { HowItWorks } from './components/sections/HowItWorks';
import { Wallet } from './components/sections/Wallet';
import { Extension } from './components/sections/Extension';
import { Quests } from './components/sections/Quests';
import { Companies } from './components/sections/Companies';
import { RampChart } from './components/sections/RampChart';
import { Settlement } from './components/sections/Settlement';
import { Cta } from './components/sections/Cta';
import { Footer } from './components/sections/Footer';
import { Raise } from './pages/Raise';
import { Partners } from './pages/Partners';
import { Docs } from './pages/Docs';
import { useLinkInterceptor, usePath } from './lib/router';
import { isRaiseHost } from './lib/site';

function Home() {
  return (
    <main id="top">
      <Hero />
      <HowItWorks />
      <Wallet />
      <Extension />
      <Quests />
      <RampChart />
      <Settlement />
      <Companies />
      <Cta />
    </main>
  );
}

const pages: Record<string, { title: string; el: () => JSX.Element }> = {
  '/': { title: 'Gami Protocol', el: Home },
  '/raise': { title: 'Raise · Gami Protocol', el: Raise },
  '/partners': { title: 'Partners · Gami Protocol', el: Partners },
  '/docs': { title: 'Docs · Gami Protocol', el: Docs },
};

/**
 * Home page order is the explainer: pay → wallet → extension → play and quest → the ramp → settlement → plug in → CTA.
 * The consumer story runs first and the company story (MCP server, partners) follows it.
 * Section bands alternate (plain / band) so each pair reads as a step down the page. /raise, /partners and /docs are separate pages.
 */
export default function App() {
  useLinkInterceptor();
  const path = usePath();
  // On the raise subdomain the root is the raise page; anything else there falls back to it too.
  const page = isRaiseHost() ? pages['/raise'] : pages[path] ?? pages['/'];
  useEffect(() => {
    document.title = page.title;
  }, [page.title]);
  const Page = page.el;
  return (
    <>
      <SvgDefs />
      <Nav />
      <Page />
      <Footer />
    </>
  );
}

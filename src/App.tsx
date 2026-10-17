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

/**
 * Page order is the explainer: pay → wallet → extension → play and quest → plug in → the ramp → settlement → CTA.
 * Section bands alternate (plain / band) so each pair reads as a step down the page.
 */
export default function App() {
  return (
    <>
      <SvgDefs />
      <Nav />
      <main id="top">
        <Hero />
        <HowItWorks />
        <Wallet />
        <Extension />
        <Quests />
        <Companies />
        <RampChart />
        <Settlement />
        <Cta />
      </main>
      <Footer />
    </>
  );
}

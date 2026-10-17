import { useMemo, useState } from 'react';
import { CONVERT_FLOOR_XP, MONTHS, niceMax, rampSeries } from '../../lib/economics';
import { SectionHead } from '../ui/Primitives';

const fmt = (n: number, d = 0) => n.toLocaleString('en-GB', { maximumFractionDigits: d, minimumFractionDigits: d });

const SERIES = {
  xp: '#9c6cff',
  gami: '#ffeb55',
  usdc: '#4ade80',
} as const;

interface PanelProps {
  id: string;
  data: number[];
  color: string;
  height: number;
  label: string;
  ariaLabel: string;
  end: (v: number) => string;
  floor?: number;
  focal?: boolean;
}

/** One ramp panel: area + line, recessive grid, endpoint marker, axis-end labels. Drawn to one scale. */
function Panel({ id, data, color, height, label, ariaLabel, end, floor, focal }: PanelProps) {
  const W = 720;
  const padL = 16, padR = 96, padT = 18, padB = 28;
  const iw = W - padL - padR, ih = height - padT - padB;
  const max = niceMax(Math.max(...data, floor ?? 0) * 1.08);
  const x = (i: number) => padL + (iw * i) / MONTHS;
  const y = (v: number) => padT + ih * (1 - v / max);
  const line = data.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${y(v)}`).join(' ');
  const ex = x(MONTHS), ey = y(data[MONTHS]);
  const mono = { fontFamily: 'JetBrains Mono, monospace', fontSize: 11 } as const;

  return (
    <svg id={id} viewBox={`0 0 ${W} ${height}`} role="img" aria-label={ariaLabel}>
      {[0, 1, 2, 3, 4].map((g) => {
        const gy = padT + (ih * g) / 4;
        return <line key={g} x1={padL} x2={padL + iw} y1={gy} y2={gy} stroke="rgba(255,255,255,.08)" strokeWidth={1} />;
      })}
      <path d={`${line} L${x(MONTHS)} ${y(0)} L${x(0)} ${y(0)} Z`} fill={color} fillOpacity={0.12} />
      <path d={line} fill="none" stroke={color} strokeWidth={focal ? 3 : 2} strokeLinejoin="round" />
      {floor && floor < max ? (
        <>
          <line x1={padL} x2={padL + iw} y1={y(floor)} y2={y(floor)} stroke="#9ca3af" strokeWidth={2} strokeDasharray="6 6" />
          <text x={padL + iw - 4} y={y(floor) - 6} textAnchor="end" fill="#9ca3af" style={{ ...mono, letterSpacing: 1 }}>
            CONVERT FLOOR {fmt(floor)} XP
          </text>
        </>
      ) : null}
      <rect x={ex - 5} y={ey - 5} width={10} height={10} fill={color} stroke="#000" strokeWidth={2} />
      <text x={ex + 12} y={ey + 4} fill={color} style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16 }}>
        {end(data[MONTHS])}
      </text>
      <text x={padL} y={padT - 6} fill="#9ca3af" style={{ ...mono, letterSpacing: 1 }}>{label}</text>
      <text x={padL + iw} y={padT - 6} textAnchor="end" fill="#6b7280" style={mono}>MAX {fmt(max)}</text>
      <text x={padL} y={height - 8} fill="#6b7280" style={mono}>M0</text>
      <text x={padL + iw / 2} y={height - 8} textAnchor="middle" fill="#6b7280" style={mono}>M6</text>
      <text x={padL + iw} y={height - 8} textAnchor="end" fill="#6b7280" style={mono}>M12</text>
    </svg>
  );
}

export function RampChart() {
  const [spend, setSpend] = useState(800);
  const [play, setPlay] = useState(1500);
  const [conv, setConv] = useState(50);
  const [rule, setRule] = useState(1);

  const s = useMemo(
    () => rampSeries({ monthlySpend: spend, monthlyPlayXp: play, convertShare: conv / 100, merchantRule: rule / 100 }),
    [spend, play, conv, rule],
  );

  return (
    <section className="sec" id="ramp">
      <div className="wrap">
        <SectionHead
          eyebrow="XP ECONOMICS · THE RAMP"
          title="Spend ramps XP. XP ramps into GAMI and USDC."
          intro="Move the four rules and watch twelve months of spending, playing and questing turn into points, token and stablecoin. Every GAMI point on the chart is the protocol's own rate function."
        />

        <div className="ramp">
          <div className="ctrls">
            <div className="ctrl">
              <label htmlFor="spend">Monthly card spend <output id="spendOut">£{fmt(spend)}</output></label>
              <input type="range" id="spend" min={100} max={3000} step={50} value={spend} onChange={(e) => setSpend(+e.target.value)} />
              <p>1 XP per £1 settled at the base rate. Streaks lift it a little each month.</p>
            </div>
            <div className="ctrl">
              <label htmlFor="play">Play and quest XP per month <output id="playOut">{fmt(play)}</output></label>
              <input type="range" id="play" min={0} max={6000} step={100} value={play} onChange={(e) => setPlay(+e.target.value)} />
              <p>Missions, quests and yield tasks that mature. Same ledger as card XP.</p>
            </div>
            <div className="ctrl">
              <label htmlFor="conv">XP converted to GAMI <output id="convOut">{conv}%</output></label>
              <input type="range" id="conv" min={0} max={100} step={5} value={conv} onChange={(e) => setConv(+e.target.value)} />
              <p>Only XP above the 1,000 XP floor converts. The rest stays as XP for quests.</p>
            </div>
            <div className="ctrl">
              <label htmlFor="rule">Merchant USDC rule <output id="ruleOut">{rule.toFixed(2).replace(/0$/, '')}%</output></label>
              <input type="range" id="rule" min={0} max={3} step={0.25} value={rule} onChange={(e) => setRule(+e.target.value)} />
              <p>The share of each payment the merchant settles back to you in USDC on Base.</p>
            </div>
            <div className="kpis">
              <div><span>XP · month 12</span><b className="xp">{fmt(s.xp[MONTHS])}</b></div>
              <div><span>GAMI · month 12</span><b className="gm">{fmt(s.gami[MONTHS], 1)}</b></div>
              <div><span>USDC · month 12</span><b className="us">{fmt(s.usdc[MONTHS], 2)}</b></div>
            </div>
          </div>

          <div className="charts">
            <div className="hd">
              <b>Twelve-month ramp</b>
              <div className="lg">
                <span className="s1">XP earned · card + play</span>
                <span className="s2">GAMI converted</span>
                <span className="s3">USDC settled</span>
                <span className="s4">Convert floor</span>
              </div>
            </div>
            <Panel id="cXp" data={s.xp} color={SERIES.xp} height={300} label="XP EARNED · CARD + PLAY" ariaLabel="XP earned over twelve months" end={(v) => `${fmt(v)} XP`} floor={CONVERT_FLOOR_XP} focal />
            <Panel id="cGami" data={s.gami} color={SERIES.gami} height={170} label="GAMI CONVERTED" ariaLabel="GAMI converted over twelve months" end={(v) => `${fmt(v, 1)} GAMI`} />
            <Panel id="cUsdc" data={s.usdc} color={SERIES.usdc} height={170} label="USDC SETTLED" ariaLabel="USDC settled over twelve months" end={(v) => `${fmt(v, 2)} USDC`} />
            <p className="cap">Illustrative. 1 XP per £1 settled plus play and quest XP, streak-lifted. Rate: R(t) = R0 · (S_target / S(t))^0.5, with outstanding XP supply growing 8% a month. Live figures come from the ledger.</p>
          </div>
        </div>

        <div className="infl">
          <div>
            <h3>Why the token line bends</h3>
            <p>XP is minted by everyone questing, so the outstanding pile grows. The conversion rate falls as it does: four times the supply halves the rate. Converting early buys more GAMI per XP than converting late.</p>
            <div className="f"><b>R(t)</b> = R0 · (S_target / S(t))<b>^alpha</b></div>
          </div>
          <div>
            <h3>Why the stable line is straight</h3>
            <p>USDC rewards are a merchant rule on settled spend, not a market. Same rule, same spend, same payout. It does not inflate and it does not need converting.</p>
            <div className="f"><b>usdc</b> = settled_spend × merchant_rule</div>
          </div>
        </div>
      </div>
    </section>
  );
}

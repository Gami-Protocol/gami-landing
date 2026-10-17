/** Hero device: Gami Wallet home with XP, level, card spend and balances. Square-cornered per ARCADE. */
export function PhoneMock() {
  return (
    <div className="phone" aria-label="Gami Wallet home screen">
      <div className="notch"><span>9:41</span><span>BASE · 8453</span></div>
      <div className="scr">
        <div className="ttl">GAMI WALLET</div>
        <div className="xpbig">12,480<small>XP · LEVEL 7</small></div>
        <div className="lvl"><span>LEVEL 7</span><span>2,020 XP TO 8</span></div>
        <div className="bar"><i /></div>
        <div className="qcard">
          <div className="qn">Card spend · this week</div>
          <div className="qs">£186.40 settled across 4 payments</div>
          <div className="qx">+186 XP · STREAK ×1.2</div>
        </div>
        <div className="qrow">
          <div className="chip">GAMI<b>48.2</b></div>
          <div className="chip">USDC<b>21.10</b></div>
        </div>
      </div>
    </div>
  );
}

/** Wallet section device: rewards ledger and the convert flow. */
export function WalletLedgerMock() {
  return (
    <div className="phone2">
      <div className="notch"><span>9:41</span><span>GAMI WALLET</span></div>
      <div className="scr">
        <div className="ttl eyebrow">REWARDS · HISTORY</div>
        <div className="hist">
          <div><span>Card · coffee roasters</span><b className="plus">+42 XP</b></div>
          <div><span>Quest · 5-day streak</span><b className="plus">+250 XP</b></div>
          <div><span>Convert · 4,000 XP</span><b className="tok">+38.1 GAMI</b></div>
          <div><span>Reward · merchant bonus</span><b className="plus">+6.50 USDC</b></div>
          <div><span>Refund · reversed</span><b style={{ color: '#ef4444' }}>−18 XP</b></div>
        </div>
        <div className="cv">
          <div className="r"><span>CONVERT</span><b>4,000 XP</b></div>
          <div className="big">38.1 GAMI</div>
          <div className="r"><span>RATE</span><b>0.00952 GAMI / XP</b></div>
          <div className="r"><span>FLOOR</span><b>1,000 XP</b></div>
        </div>
        <div className="pbtn">Confirm · gasless</div>
      </div>
    </div>
  );
}

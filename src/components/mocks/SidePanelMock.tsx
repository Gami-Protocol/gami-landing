/** Chrome extension side panel: Quests / NOVA / Rewards / Settings, quest on the current site. */
export function SidePanelMock() {
  return (
    <div className="panel">
      <span className="badge">Manifest V3 · 0.2.7</span>
      <div className="top">
        <b>GAMI</b>
        <span className="mono" style={{ fontSize: 10, color: '#9ca3af', letterSpacing: '.1em' }}>LEVEL 7 · 12,480 XP</span>
      </div>
      <div className="tabs"><span className="on">QUESTS</span><span>NOVA</span><span>REWARDS</span><span>SETTINGS</span></div>
      <div className="body">
        <div className="site"><span>CURRENT SITE</span><b>northstar-roasters.co.uk</b></div>
        <div className="pq">
          <div className="t">Spend £50 this month<span>+120 XP</span></div>
          <div className="d">£32.60 settled from 2 card payments · 17 days left</div>
          <div className="pb"><i style={{ width: '65%' }} /></div>
        </div>
        <div className="pbtn">Verify last payment</div>
        <div className="nova"><b>NOVA</b>Your last payment here earned 42 XP. 2,020 XP to level 8 at your current pace: about 11 days.</div>
        <div className="bal">
          <div><small>USDC · Base</small><b>21.10</b><i>● LIVE RPC</i></div>
          <div><small>GAMI</small><b>48.2</b><i>● BASE</i></div>
        </div>
      </div>
    </div>
  );
}

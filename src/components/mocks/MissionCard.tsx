import { Eyebrow, TrustBadge } from '../ui/Primitives';

/** Example sponsored mission. Studio name is a placeholder. */
export function MissionCard() {
  return (
    <div className="mission" aria-label="Example sponsored mission card">
      <div className="mh">
        <div>
          <Eyebrow>SPONSORED MISSION</Eyebrow>
          <b style={{ display: 'block', marginTop: 8 }}>Clear the vault · season 2</b>
        </div>
        <span className="sp">Sponsored · Northstar Games</span>
      </div>
      <div className="obj">
        <div><i className="done" />Play 3 ranked rounds<span>+90 XP</span></div>
        <div><i className="done" />Reach floor 12<span>+120 XP</span></div>
        <div><i />Finish with the studio's new hero<span>+90 XP</span></div>
      </div>
      <div className="mf">
        <div className="xp">300 XP<small>Confirmed on the studio's server · signed</small></div>
        <TrustBadge level="attested">Attested</TrustBadge>
      </div>
      <div className="pbtn">Claim · gasless</div>
    </div>
  );
}

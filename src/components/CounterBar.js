import React from 'react';

import { totalIncumbentsForParty } from './utils';

export default (props) => {
  const totalDReps = (totalIncumbentsForParty(props.allPledgers, 'D', true));
  const totalDCandidates = (totalIncumbentsForParty(props.allPledgers, 'D', false));
  const totalIReps = (totalIncumbentsForParty(props.allPledgers, 'I', true));
  const totalICandidates = (totalIncumbentsForParty(props.allPledgers, 'I', false));
  const totalRCandidates = (totalIncumbentsForParty(props.allPledgers, 'R', false));
  const totalRReps = (totalIncumbentsForParty(props.allPledgers, 'R', true));

  const total = totalDReps + totalDCandidates + totalRReps + totalRCandidates + totalIReps + totalICandidates;

  const dRepsPercent = (totalDReps / total) * 100;
  const dCandidatePercent = (totalDCandidates / total) * 100;
  const iRepsPercent = (totalIReps / total) * 100;
  const iCandidatePercent = (totalICandidates / total) * 100;
  const rRepsPercent = (totalRReps / total) * 100;
  const rCandidatePercent = (totalRCandidates / total) * 100;

  return (
    <div className="container-fluid">
      <div className="row header-pledge--count">
        <div style={{ flexBasis: `${dRepsPercent}%` }} className="democrat" title="Democratic Representatives">{totalDReps}</div>
        <div style={{ flexBasis: `${dCandidatePercent}%` }} className="democrat-candidate" title="Democratic Candidates">{totalDCandidates}</div>
        <div style={{ flexBasis: `${iRepsPercent}%` }} className="independent" title="Independent Representatives">{totalIReps}</div>
        <div style={{ flexBasis: `${iCandidatePercent}%` }} className="independent-candidate" title="Independent Candidates">{totalICandidates}</div>
        <div style={{ flexBasis: `${rCandidatePercent}%` }} className="republican-candidate" title="Republican Candidates">{totalRCandidates}</div>
        <div style={{ flexBasis: `${rRepsPercent}%` }} className="republican" title="Republican Representatives">{totalRReps}</div>
      </div>
    </div>
  );
};

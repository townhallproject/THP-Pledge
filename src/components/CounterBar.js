import React from 'react';
import { Popover } from 'antd';

import { totalIncumbentsForParty } from '../utils';

/* eslint-disable */
require('style-loader!css-loader!antd/es/popover/style/index.css');
/* eslint-enable */

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
        <Popover content="Pledged Democratic Representatives" placement="topLeft" >
          <div style={{ flexBasis: `${dRepsPercent}%` }} className="democrat" >{totalDReps}</div>
        </Popover>
        <Popover content="Pledged Democratic Candidates" >
          <div style={{ flexBasis: `${dCandidatePercent}%` }} className="democrat-candidate" title="Democratic Candidates">{totalDCandidates}</div>
        </Popover>
        <Popover content="Pledged Independent Representatives">
          <div style={{ flexBasis: `${iRepsPercent}%` }} className="independent" title="Independent Representatives">{totalIReps}</div>
        </Popover>
        <Popover content="Pledged Independent Candidates">
          <div style={{ flexBasis: `${iCandidatePercent}%` }} className="independent-candidate" title="Independent Candidates">{totalICandidates}</div>
        </Popover>
        <Popover content="Pledged Republican Candidates" placement="topRight">
          <div style={{ flexBasis: `${rCandidatePercent}%` }} className="republican-candidate" title="Republican Candidates">{totalRCandidates}</div>
        </Popover>
        <Popover content="Pledged Republican Representatives" placement="topRight">
          <div style={{ flexBasis: `${rRepsPercent}%` }} className="republican" title="Republican Representatives">{totalRReps}</div>
        </Popover>
      </div>
    </div>
  );
};

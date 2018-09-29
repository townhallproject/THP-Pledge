import React from 'react';
import { Popover } from 'antd';

import PropTypes from 'prop-types';
import { totalIncumbentsForParty } from '../../utils';

/* eslint-disable */
require('style-loader!css-loader!antd/es/popover/style/index.css');
import './style.scss';
/* eslint-enable */

const CounterBar = (props) => {
  const totalDReps = (totalIncumbentsForParty(props.allPledgers, 'D', true));
  const totalDCandidates = (totalIncumbentsForParty(props.allPledgers, 'D', false));
  const totalIReps = (
    totalIncumbentsForParty(props.allPledgers, 'I', true) +
    totalIncumbentsForParty(props.allPledgers, 'G', true) + 
    totalIncumbentsForParty(props.allPledgers, 'L', true)
  );
  const totalICandidates = (
    totalIncumbentsForParty(props.allPledgers, 'I', false) +
    totalIncumbentsForParty(props.allPledgers, 'G', false) +
    totalIncumbentsForParty(props.allPledgers, 'L', false)
  );
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
        <Popover content="Pledged Democratic incumbents" placement="topLeft" >
          <div style={{ flexBasis: `${dRepsPercent}%` }} className="democrat" >{totalDReps}</div>
        </Popover>
        <Popover content="Pledged Democratic challengers" >
          <div style={{ flexBasis: `${dCandidatePercent}%` }} className="democrat-candidate" title="Democratic Candidates">{totalDCandidates}</div>
        </Popover>
        <Popover content="Pledged Independent and 3rd Party incumbents">
          <div style={{ flexBasis: `${iRepsPercent}%` }} className="independent" title="Independent Representatives">{totalIReps}</div>
        </Popover>
        <Popover content="Pledged Independent and 3rd Party challengers">
          <div style={{ flexBasis: `${iCandidatePercent}%` }} className="independent-candidate" title="Independent Candidates">{totalICandidates}</div>
        </Popover>
        <Popover content="Pledged Republican challengers" placement="topRight">
          <div style={{ flexBasis: `${rCandidatePercent}%` }} className="republican-candidate" title="Republican Candidates">{totalRCandidates}</div>
        </Popover>
        <Popover content="Pledged Republican incumbents" placement="topRight">
          <div style={{ flexBasis: `${rRepsPercent}%` }} className="republican" title="Republican Representatives">{totalRReps}</div>
        </Popover>
      </div>
    </div>
  );
};
CounterBar.propTypes = {
  allPledgers: PropTypes.shape({}).isRequired,
};

export default CounterBar;

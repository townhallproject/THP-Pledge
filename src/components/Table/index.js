import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Badge,
} from 'antd';
import { filter } from 'lodash';

import { PLEDGED_COLOR_DARK } from '../constants';
import ElectedOfficeCell from '../ElectedOfficeCell';
import { stateAbrvToName } from '../../data/dictionaries';
import { totalPledgedInState } from '../../utils';
/* eslint-disable */
require('style-loader!css-loader!antd/es/card/style/index.css');
require('style-loader!css-loader!antd/es/list/style/index.css');
require('style-loader!css-loader!antd/es/badge/style/index.css');
import './style.scss';
/* eslint-enable */

class Table extends React.Component {
  render() {
    const {
      items,
      allDoYourJobDistricts,
      isCurrentYear,
    } = this.props;

    const emptyMessage = isCurrentYear ? 'No candidates have taken the pledge yet in this state' : 'No winning candidates took the pledge in this state';
    const stateAbbreviations = Object.keys(items);

    stateAbbreviations.sort((a, b) => {
      const stateA = stateAbrvToName[a].toLowerCase();
      const stateB = stateAbrvToName[b].toLowerCase();
      if (stateA < stateB) return -1;
      if (stateA > stateB) return 1;
      return 0;
    });

    return stateAbbreviations
      .map((state) => {
        const doYourJobDistricts = filter(allDoYourJobDistricts, ele => (ele.state === state));
        return (
          <React.Fragment key={state}>
            <Card
              extra={items[state] && totalPledgedInState(items[state]) > 0 ? (
                <React.Fragment>
                  <span>
                    Total pledged:
                  </span>
                  <Badge count={totalPledgedInState(items[state]) ? totalPledgedInState(items[state]) : 0} style={{ backgroundColor: PLEDGED_COLOR_DARK }} />
                  <div className="card-footer">* Incumbent
                  </div>
                </React.Fragment>) : null}
              title={stateAbrvToName[state]}
              bordered={false}
              className="state-card"
              grid={{
                gutter: 16,
                lg: 4,
                md: 4,
                sm: 2,
                xl: 6,
                xs: 1,
                xxl: 3,
              }}
            >
              {totalPledgedInState(items[state]) === 0 ? (
                <span>{emptyMessage}</span>) : (<ElectedOfficeCell
                  key={`${state}-cell`}
                  stateName={state}
                  items={items[state]}
                  doYourJobDistricts={doYourJobDistricts}
                />)}
            </Card>
          </React.Fragment>
        );
      });
  }
}

Table.propTypes = {
  allDoYourJobDistricts: PropTypes.shape({}).isRequired,
  isCurrentYear: PropTypes.bool.isRequired,
  items: PropTypes.shape({}).isRequired,
};

export default Table;

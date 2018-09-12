import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import {
  mapKeys,
  filter,
} from 'lodash';

import DistrictCell from '../DistrictCell';
import { stateAbrvToName } from '../../data/dictionaries';
import { totalPledgedInState } from '../../utils';

/* eslint-disable */
require('style-loader!css-loader!antd/es/card/style/index.css');
require('style-loader!css-loader!antd/es/list/style/index.css');
import './style.scss';
/* eslint-enable */

class Table extends React.Component {
  render() {
    const {
      items,
      allDoYourJobDistricts,
    } = this.props;
    return Object.keys(items)
      .map((state) => {
        if (!totalPledgedInState(items[state])) {
          return null;
        }

        const doYourJobDistricts = filter(allDoYourJobDistricts, ele => (ele.state === state));

        return (
          <React.Fragment>
            <Card
              key={state}
              extra={items[state] ? (
                <React.Fragment>Total pledged candidates: {items[state] ? totalPledgedInState(items[state]) : 0}
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
              <DistrictCell
                key={`${state}-cell`}
                stateName={state}
                items={items[state]}
                doYourJobDistricts={doYourJobDistricts}
              />
            </Card>
          </React.Fragment>
        );
      });
  }
}

Table.propTypes = {
  items: PropTypes.shape({}).isRequired,
};

export default Table;

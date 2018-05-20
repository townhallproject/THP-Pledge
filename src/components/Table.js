import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';

import DistrictCell from './DistrictCell';
import { stateAbrvToName } from '../data/dictionaries';
import { totalPledgedInState } from './utils';

/* eslint-disable */
require('style-loader!css-loader!antd/es/card/style/index.css');
/* eslint-enable */

class Table extends React.Component {

  render() {
    const {
      items,
    } = this.props;
    if (!items) {
      return (
        <div id="pledgers-list">
          <p className="no-results">Looks like there are no events near you right now. You can create your own
          </p>
        </div>
      );
    }
    return Object.keys(items)
      .map(state =>
        (
          <React.Fragment>
            <Card
              key={state}
              extra={<React.Fragment>Total pledged candidates: {totalPledgedInState(items[state])}<div className="card-footer">* Incumbent</div></React.Fragment>}
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
              />
            </Card>
          </React.Fragment>
        ));
  }
}

Table.propTypes = {
  items: PropTypes.shape({}).isRequired,
};

export default Table;

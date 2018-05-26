import React from 'react';
import PropTypes from 'prop-types';
import { List, Card } from 'antd';

import { getTitle } from '../data/dictionaries';
import PledgerCell from './PledgerCell';
/* eslint-disable */
require('style-loader!css-loader!antd/es/list/style/index.css');
/* eslint-enable */

const gridStyle = {
  maxWidth: '310px',
};
const getOrder = (pledger) => {
  if (pledger.incumbent) {
    return 0;
  }
  const statusOrder = {
    'Active Primary Candidate': 2,
    'Lost Primary': 3,
    Nominee: 1,
  };
  
  return statusOrder[pledger.status];
};

class DistrictCell extends React.Component {
  render() {
    const {
      items,
      stateName,
    } = this.props;
    if (items === null) {
      return <li>No Pledgers</li>;
    }
    return Object.keys(items)
      .sort((a, b) => {
        if (!Number(a)) {
          return -1;
        }
        if (!Number(b)) {
          return 1;
        }
        return a - b;
      })
      .map((district) => {
        if (!items[district]) {
          return (
            <Card title={`${stateName}-${district}`}>
              No Pledgers
            </Card>);
        }
        const title = `${(Number(district) ? `${stateName}-${district}` : getTitle(district))}`;

        return (
          <Card
            style={gridStyle}
            title={title}
            extra="Pledged"
            bordered={false}
            className="district-card"
            hoverable
          >
            <List
              id={district}
              itemLayout="horizontal"
              dataSource={items[district].sort((a, b) => getOrder(a) - getOrder(b))}
              renderItem={item =>
                (
                  <List.Item key={item.displayName}>
                    <PledgerCell
                      key={`${item.displayName}-cell`}
                      item={item}
                    />
                  </List.Item>
                )}
            />
          </Card >
        );
      });
  }
}

DistrictCell.propTypes = {
  items: PropTypes.shape({}),
  stateName: PropTypes.string.isRequired,
};

DistrictCell.defaultProps = {
  items: {},
};

export default DistrictCell;

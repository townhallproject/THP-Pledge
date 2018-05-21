import React from 'react';
import PropTypes from 'prop-types';
import { List, Card } from 'antd';

import { getTitle } from '../data/dictionaries';
import PledgerCell from './PledgerCell';
/* eslint-disable */
require('style-loader!css-loader!antd/es/list/style/index.css');
/* eslint-enable */

const gridStyle = {
  margin: '.5em',
  maxWidth: '310px',
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
        return 0;
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
              dataSource={items[district].sort((a, b) => {
              if (a.incumbent) {
                return -1;
              }
              if (b.incumbent) {
                return 1;
              }
              return 0;
            })}
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

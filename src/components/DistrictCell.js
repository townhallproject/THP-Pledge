import React from 'react';
import PropTypes from 'prop-types';
import { List, Card } from 'antd';

import { officeDict } from '../data/dictionaries'
import PledgerCell from './PledgerCell';
/* eslint-disable */
require('style-loader!css-loader!antd/es/list/style/index.css');
/* eslint-enable */

const gridStyle = {
  maxWidth: '310px',
  margin: '.5em',
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
    return Object.keys(items).map((district) => {
      if (!items[district]) {
        return (
          <Card title={`${stateName}-${district}`}>
          No Pledgers
          </Card>);
      }
      const title = `${(parseInt(district) ? `${stateName}-${district}` : officeDict[district])}`

      return (
        <Card
          style={gridStyle}
          title={title}
          bordered={false}
          hoverable={true}
        >
          <List
            id={district}
            itemLayout="horizontal"
            grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }}
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
                  <List.Item key={item.id}>
                    <PledgerCell
                      key={`${item.id}-cell`}
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
  items: PropTypes.shape({}).isRequired,
  stateName: PropTypes.string.isRequired,
};

export default DistrictCell;

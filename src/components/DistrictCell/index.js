import React from 'react';
import PropTypes from 'prop-types';
import { List, Card } from 'antd';
import { find } from 'lodash';
import { getTitle } from '../../data/dictionaries';
import PledgerCell from '../PledgerCell';
import { DYJD_COLOR } from '../constants';
/* eslint-disable */
require('style-loader!css-loader!antd/es/list/style/index.css');
/* eslint-enable */

const gridStyle = {
  maxWidth: '310px',
  borderColor: DYJD_COLOR,
};

const getCardOrder = (districtOrStateWide) => {
  if (Number(districtOrStateWide)) {
    return districtOrStateWide;
  }
  if (districtOrStateWide.split('-').length > 1) {
    return 500;
  }
  return 0;
};

const getPeopleOrder = (pledger) => {
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
  isDoYourJob(district) {
    const {
      doYourJobDistricts,
    } = this.props;
    let isDoYourJobDistrict;
    if (doYourJobDistricts.length > 0 && !isNaN(Number(district))) {
      isDoYourJobDistrict = find(doYourJobDistricts, {
        district: Number(district),
      });
    } else if (doYourJobDistricts.length > 0) {
      isDoYourJobDistrict = find(doYourJobDistricts, (ele) => (typeof ele.district === 'string' &&  ele.district.slice(0, 3) === district));
    }
    return isDoYourJobDistrict;
  }

  render() {
    const {
      items,
      stateName,
    } = this.props;
    if (items === null) {
      return <li>No Pledgers</li>;
    }
    return Object.keys(items)
      .sort((a, b) => getCardOrder(a) - getCardOrder(b))
      .map((district) => {
        if (!items[district]) {
          return (
            <Card title={`${stateName}-${district}`}>
              No Pledgers
            </Card>);
        }
        const title = `${(Number(district) ? `${stateName}-${district}` : getTitle(district))}`;
        const isDoYourJob = !!this.isDoYourJob(district);

        return (
          <Card
            style={gridStyle}
            title={title}
            extra="Pledged"
            bordered={isDoYourJob}
            className="district-card"
            hoverable
          >
            <List
              id={district}
              itemLayout="horizontal"
              dataSource={items[district].sort((a, b) => getPeopleOrder(a) - getPeopleOrder(b))}
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

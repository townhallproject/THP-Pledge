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
  borderColor: DYJD_COLOR,
  maxWidth: '310px',
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
    'Active Primary Candidate': 3,
    'Lost Primary': 4,
    Nominee: 2,
    Won: 1,
  };

  return statusOrder[pledger.status];
};

class ElectedOfficeCell extends React.Component {
  isDoYourJob(district) {
    const {
      doYourJobDistricts,
    } = this.props;
    let isDoYourJobDistrict;
    if (doYourJobDistricts.length > 0 && !isNaN(Number(district))) {
      // rep 
      isDoYourJobDistrict = find(doYourJobDistricts, (ele) => {
        const testDistrict = Number(ele.district) === 0 ? 1 : Number(ele.district);
        return testDistrict === Number(district);
      });
    } else if (doYourJobDistricts.length > 0) {
      // sen
      isDoYourJobDistrict = find(
        doYourJobDistricts, (ele) => {
          const dyjdStateRank = ele.key.split('-')[1];
          const thiDistrictStateRank = district.split(' ')[1];
          return typeof ele.district === 'string' && dyjdStateRank === thiDistrictStateRank;
        });
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
        if (items[district].length === 0) {
          return null;
        }
        const title = `${(Number(district) ? `${stateName}-${district}` : getTitle(district))}`;
        const isDoYourJob = !!this.isDoYourJob(district);
        return (
          <Card
            style={gridStyle}
            title={(
              <React.Fragment>{title} {isDoYourJob ? <span className="do-your-job-icon-small" /> : null }</React.Fragment>)}
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

ElectedOfficeCell.propTypes = {
  doYourJobDistricts: PropTypes.shape({}),
  items: PropTypes.shape({}),
  stateName: PropTypes.string.isRequired,
};

ElectedOfficeCell.defaultProps = {
  doYourJobDistricts: {},
  items: {},
};

export default ElectedOfficeCell;

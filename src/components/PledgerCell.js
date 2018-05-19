import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon, List } from 'antd';

class PledgerCell extends React.Component {
  static renderIncumbent(item) {
    if (item.incumbent) {
      return 'Incumbent';
    }
    return null;
  }

  render() {
    const {
      item,
    } = this.props;
    const pledgerCellClass = classNames({
      incumbent: item.incumbent,
      pledged: item.pledged,
      'pledger-cell': true,
    });
    if (!item.displayName) {
      return null;
    }
    const title = `${item.incumbent && item.status ? `${item.role}.` : `${item.status}:`} ${item.displayName} (${item.party})`;
    const description = item.pledged ? (<Icon type="check-circle" />) : (<Icon type="question-circle-o" />);
    return (
      <List.Item.Meta
        bodystyle={{ padding: '5px' }}
        className={pledgerCellClass}
        title={<div>{PledgerCell.renderIncumbent(item)} {title}</div>}
        description={<div>Pledged: {description}</div>}
      />
    );
  }
}

PledgerCell.propTypes = {
  item: PropTypes.shape({}).isRequired,
};

export default PledgerCell;

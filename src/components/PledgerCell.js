import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon, List } from 'antd';
import { pledgerShape } from '../state/pledgers/types';

class PledgerCell extends React.Component {
  render() {
    const {
      item,
    } = this.props;
    const pledgerCellClass = classNames({
      incumbent: item.incumbent,
      'pledger-cell': true,
    });

    const pledgerStatusClass = classNames({
      'pledge-status': true,
      pledged: item.pledged,
    });

    if (!item.displayName) {
      return null;
    };

    const title = item.incumbent ? (
      <React.Fragment>{item.role.split(' ')[0]}. {item.displayName}* <span className={item.party}>({item.party})</span>
        {item.missingMember ? <span className="missing-member-icon" /> : null}
      </React.Fragment>) :
      (<React.Fragment>{item.displayName} <span className={item.party}>({item.party})</span></React.Fragment>);

    const description = item.pledged ? (<Icon type="check-circle" />) : (<Icon type="question-circle-o" />);
   
    return (
      <React.Fragment>
        <List.Item.Meta
          bodystyle={{ padding: '5px' }}
          className={pledgerCellClass}
          title={<div>{title}</div>}
          description={item.status ? <div>{item.status}</div> : null}
        />
        <div className={pledgerStatusClass}>{description}</div>
      </React.Fragment>
    );
  }
}

PledgerCell.propTypes = {
  item: PropTypes.shape(pledgerShape).isRequired,
};

export default PledgerCell;

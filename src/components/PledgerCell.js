import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Icon,
  List,
  Avatar,
  Popover,
  Badge,
} from 'antd';
import { pledgerShape } from '../state/pledgers/types';

/* eslint-disable */
require('style-loader!css-loader!antd/es/avatar/style/index.css');
require('style-loader!css-loader!antd/es/tooltip/style/index.css');

/* eslint-enable */

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
    }

    const title = item.incumbent ? (
      <React.Fragment>{item.role.split(' ')[0]}. {item.displayName}* <span className={item.party}>({item.party})</span>
      </React.Fragment>) :
      (<React.Fragment>{item.displayName} <span className={item.party}>({item.party})</span></React.Fragment>);

    let description = (<Icon type="question-circle-o" />);
    if (item.missingMember) {
      // description = (<span className="missing-member-icon" />)
      description = (
        <Popover title="Missing Member" content={(
          <React.Fragment>
            <p><Avatar size="large" src="/images/missing-member-logo.svg"/>  Has not held a single open town hall this Congressional session.</p>
          </React.Fragment>
        )}>
              <Avatar src="/images/missing-member-logo.svg" />
        </Popover>
      );
    } else if (item.pledged) {
      description = item.hoverText ? (
            <Popover content={item.hoverText}>
              <Badge dot>
              <Icon type="check-circle" />
              </Badge>
            </Popover>
        ): (<Icon type="check-circle" />);
    }

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

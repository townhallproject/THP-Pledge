import React from 'react';
import FilterBar from '../FilterBar';
import './style.scss';

export default class Legend extends React.Component {
  render() {
    const { 
      addFilterBy, 
      filterBy, 
      removeFilterBy
    } = this.props;
    return (
      <div className="map-legend">
         <FilterBar
          className="filterBar"
          addFilterBy={addFilterBy}
          filterBy={filterBy}
          removeFilterBy={removeFilterBy}
        />
        <ul className="list-inline">
          <li className="map-legend-li hide-if-no-webgl">
            <dt className="statewide-dyjd" />
            <dd><strong>Do Your Job</strong> State</dd>
          </li>
          <li className="map-legend-li hide-if-no-webgl">
            <dt className="district-dyjd" />
            <dd><strong>Do Your Job</strong> District</dd>
          </li>
          <li className="map-legend-li hide-if-no-webgl">
            <dt className="statewide-pledger" />
            <dd>Governor/U.S. Senate <strong>Town Hall Pledge</strong></dd>
          </li>
          <li className="map-legend-li hide-if-no-webgl">
            <dt className="district-pledger" />
            <dd>U.S. House <strong>Town Hall Pledge</strong></dd>
          </li>
          {filterBy.status.length > 1 &&
          <React.Fragment>
            <li className="map-legend-li hide-if-no-webgl">
              <dt className="missing-member-senate" />
              <dd><strong>Missing Member</strong> Senator</dd>
            </li>
            <li className="map-legend-li hide-if-no-webgl">
              <dt className="missing-member-district" />
              <dd> <strong>Missing member</strong> Rep</dd>
            </li>
          </React.Fragment>
          }
        </ul>
      </div>
    );
  }
}

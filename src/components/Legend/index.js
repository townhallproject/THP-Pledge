import React from 'react';

import './style.scss';

export default class Legend extends React.Component {
  render() {
    return (
      <div className="map-legend">
        <ul className="list-inline">
          <li className="map-legend-li hide-if-no-webgl">
            <dt className="statewide-dyjd" />
            <dd><strong>Do Your Job</strong> State</dd>
          </li>
          <li className="map-legend-li hide-if-no-webgl">
            <dt className="statewide-pledger" />
            <dd>Governor/U.S. Senate <strong>Town Hall Pledge</strong></dd>
          </li>
          <li className="map-legend-li hide-if-no-webgl">
            <dt className="district-dyjd" />
            <dd><strong>Do Your Job</strong> District</dd>
          </li>
          <li className="map-legend-li hide-if-no-webgl">
            <dt className="district-pledger" />
            <dd>U.S. House <strong>Town Hall Pledge</strong></dd>
          </li>
        </ul>
      </div>
    );
  }
}

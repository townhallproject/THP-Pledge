import React from 'react';

import './style.scss';

export default class Legend extends React.Component {
  render() {
    return (
      <div className="map-legend">
        <ul className="list-inline">
          <li className="map-legend-li hide-if-no-webgl">
            <dt className="statewide-dyjd" />
            <dd>Do Your Job State</dd>
          </li>
          <li className="map-legend-li hide-if-no-webgl">
            <dt className="statewide-pledger" />
            <dd>Statewide Town Hall Pledge</dd>
          </li>
          <li className="map-legend-li hide-if-no-webgl">
            <dt className="district-dyjd" />
            <dd>Do your job district</dd>
          </li>
          <li className="map-legend-li hide-if-no-webgl">
            <dt className="district-pledger" />
            <dd>U.S. House Town Hall Pledge</dd>
          </li>
        </ul>
      </div>
    );
  }
}

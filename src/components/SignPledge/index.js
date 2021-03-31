import React from 'react';
import { Icon } from 'antd';

import './style.scss';

export default () => (
  <div className="sign-pledge-container">
    <p>We invite every candidate running for elected office to take the Town Hall Pledge to their constituents. This simple commitment of a minimum of four town halls per year is a clear way to say: &quot;I will always listen to the people I work for.&quot;</p>
    <p>Download pledge forms here. Feel free to email signed pledges to <a href="mailto:info@townhallpledge.com">info@townhallpledge.com</a> and/or tweet a photo of your candidate holding the signed pledge and tag @townhallpledge.</p>
    <p>Thank you for your commitment to accessibility!</p>
    <a download className="download-button" href="downloads/Statewide.Pledge.2021.pdf">Download<br /> U.S. Senate/Gubernatorial form <Icon type="download" /></a>
    <a download className="download-button" href="downloads/House.Pledge.2021.pdf">Download<br /> U.S. House/Legislature form <Icon type="download" /></a>
    <a download className="download-button" href="downloads/Generic.Pledge.2021.pdf">Download<br /> other offices form <Icon type="download" /></a>
  </div>
);

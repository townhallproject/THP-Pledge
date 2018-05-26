import React from 'react';
import { Icon } from 'antd';

export default () => (
  <div className="sign-pledge-container">
    <p>Town Hall Project invites every candidate for office in 2018 to take the #TownHallPledge to the people of their district or state. This simple commitment of a minimum of four town halls per year is a clear way to say: "I will always listen to the people I work for."</p>

    <p>Download pledge forms here. Feel free to email signed pledges to <a href="mailto:info@townhallproject.com">info@townhallproject.com</a> and/or tweet a photo of your candidate holding the signed pledge.</p>

    <p>Thank you for your commitment to accessibility!</p>
    <a download className="download-button" href="downloads/THP_Pledge_Statewide.pdf">Download<br /> U.S. Senate/Gubernatorial form <Icon type="download" /></a>
    <a download className="download-button" href="downloads/THP_Pledge_House.pdf">Download<br /> U.S. House/Legislature form <Icon type="download" /></a>
    <a download className="download-button" href="downloads/THP_Pledge_state_and_local.pdf">Download<br /> other offices form <Icon type="download" /></a>
  </div>
);

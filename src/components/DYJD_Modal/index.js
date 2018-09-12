import React from 'react';
import { Modal, Button, Icon } from 'antd';

import './style.scss';
/* eslint-disable */
require('style-loader!css-loader!antd/es/modal/style/index.css');
/* eslint-enable */

class DYJDModal extends React.Component {
    constructor(props) {
        super(props);
        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.state = { visible: false };
    }

  showModal() {
    this.setState({
      visible: true,
    });
  }

  handleOk(e) {
    this.setState({
      visible: false,
    });
  }

  handleCancel(e){
    this.setState({
      visible: false,
    });
  }

  render() {
    return (
      <div className="do-your-job-modal">
        <Button type="default" onClick={this.showModal}>
          Do Your Job District Report
        </Button>
        <Modal
          style={{ top: 20 }}
          width="80%"
          cancelText={(<Button download className="download-button" href="downloads/DYJD_Infographic.png">Download Do Your Job District Report <Icon type="download" /></Button>)}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelButtonProps={{
            ghost: true,
            className: 'download-infographic-button',
          }}
        >   
          <img style={{width: '100%'}} src="/downloads/DYJD_Infographic.png" />
        </Modal>
      </div>
    );
  }
}

export default DYJDModal;
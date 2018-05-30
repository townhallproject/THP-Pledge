import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';



const { Search } = Input;

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(value) {
    const {
      submitHandler,
    } = this.props;
    submitHandler(Object.assign({}, { query: value }));
  }

  render() {
    return (
      <Search
        placeholder="zipcode, state, or district"
        onSearch={value => this.handleSubmit(value)}
        enterButton
      />
    );
  }
}

SearchBar.propTypes = {
  submitHandler: PropTypes.func.isRequired,
};

export default SearchBar;

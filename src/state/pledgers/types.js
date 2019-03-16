import PropTypes from 'prop-types';

export const pledgerShape = {
  chamber: PropTypes.string,
  displayName: PropTypes.string,
  district: PropTypes.number,
  incumbent: PropTypes.bool,
  party: PropTypes.string,
  pledged: PropTypes.bool,
  role: PropTypes.string,
  state: PropTypes.string,
  status: PropTypes.string,
};

export const allDataShape = {
  [PropTypes.string]: PropTypes.arrayOf(PropTypes.shape({ pledgerShape })),
};

export const allDataByDistrictShape = {
  [PropTypes.string]: PropTypes.shape({ [PropTypes.number]: PropTypes.arrayOf(PropTypes.shape(pledgerShape)) }),
};

import PropTypes from 'prop-types';

export const pledgerShape =  {
    state: PropTypes.string,
    displayName: PropTypes.string,
    district: PropTypes.number,
    role: PropTypes.string,
    chamber: PropTypes.string,
    pledged: PropTypes.bool,
    incumbent: PropTypes.bool,
    party: PropTypes.string,
    status: PropTypes.string,
}

export const allDataShape = {
    [PropTypes.string]: PropTypes.arrayOf(PropTypes.shape(pledgerShape)),
}
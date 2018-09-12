const initialState = {
    districts: null,
};

const pledgerReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case 'SET_DO_YOUR_JOB_DISTRICTS':
            return {
                ...state,
                districts: payload,
            };
        default:
            return state;
    }
};

export default pledgerReducer;

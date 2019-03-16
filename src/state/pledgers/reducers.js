const initialState = {
  allPledgers: null,
};

const pledgerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PLEDGERS':
      return {
        ...state,
        allPledgers: action.pledgers,
      };
    default:
      return state;
  }
};

export default pledgerReducer;

export const initialState = {
  allPledgers: null,
  mayorFeatures: null,
};

const pledgerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PLEDGERS':
      return {
        ...state,
        allPledgers: action.pledgers,
      };
    case 'SET_MAYOR_GEOJSON':
      return {
        ...state,
        mayorFeatures: action.features,
      };
    default:
      return state;
  }
};

export default pledgerReducer;

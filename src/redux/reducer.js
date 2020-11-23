import ACTIONS from "./actions";

const intitialState = {
  rawData: [],
  targetColumnName: "",
  columnNames: [],
  areStatsCalculating: false,
  isTransforming: false
};

export default (state = intitialState, action) => {
  switch (action.type) {
    case ACTIONS.Types.CREATE_TABLE:
      return {
        ...state,
        rawData: action.data,
        targetColumnName: action.targetColumnName,
        areStatsCalculating: true
      };
    case ACTIONS.Types.UPDATE_COLUMNS:
      return {
        ...state,
        columnNames: action.columns
      };
    case ACTIONS.Types.UPDATE_TABLE:
      return {
        ...state,
        rawData: action.updatedData,
        areStatsCalculating: true,
        columnNames: Object.keys(action.updatedData[0])
      };
    case ACTIONS.Types.SET_STATS_DATA:
      return {
        ...state,
        statsData: action.statsData,
        areStatsCalculating: false
      };
    case ACTIONS.Types.APPLY_TRANSFORMATION:
      return {
        ...state,
        isTransforming: action.isTransforming
      };
    default:
      return state;
  }
};

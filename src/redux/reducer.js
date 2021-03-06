import ACTIONS from "./actions";

const intitialState = {
  rawData: [],
  targetColumnName: "",
  columnNames: [],
  graphData: [],
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
        areStatsCalculating: true,
        columnNames: Object.keys(action.data[0]),
        graphData: []
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
    case ACTIONS.Types.UPDATE_GRAPH_DATA:
      return {
        ...state,
        graphData: [...state.graphData, action.graphData]
      };
    default:
      return state;
  }
};

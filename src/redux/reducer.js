import ACTIONS from "./actions";
import generateStatsFromRawData from "../StatisticalFunctions/StatsGenerator";
import { castNumericColumns } from "../Utilities/ObjectUtilities";

const intitialState = {
  rawData: [],
  targetColumnName: "",
  rawColumn: [],
};

export default (state = intitialState, action) => {
  switch (action.type) {
    case ACTIONS.Types.CREATE_TABLE:
      const castedData = castNumericColumns(action.data);
      return {
        ...state,
        rawData: castedData,
        targetColumnName: action.targetColumnName,
        statsData: generateStatsFromRawData(
          castedData,
          action.targetColumnName
        ),
      };
    case ACTIONS.Types.UPDATE_COLUMN:
      return {
        ...state,
        rawColumn: action.column,
      };
    default:
      return state;
  }
};

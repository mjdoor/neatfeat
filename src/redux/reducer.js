import ACTIONS from "./actions";
import generateStatsFromRawData from "../StatisticalFunctions/StatsGenerator";
import { castNumericColumns } from "../Utilities/ObjectUtilities";
import generateScaledNormalizationfromRawData from "../StatisticalFunctions/ScalingNormalization";

const intitialState = {
  rawData: [],
  targetColumnName: "",
  columnNames: []
};

export default (state = intitialState, action) => {
  switch (action.type) {
    case ACTIONS.Types.CREATE_TABLE:
      const castedData = castNumericColumns(action.data);
      return {
        ...state,
        rawData: castedData,
        targetColumnName: action.targetColumnName,
        statsData: generateStatsFromRawData(castedData, action.targetColumnName),
        data: castedData
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
        statsData: generateStatsFromRawData(
          action.updatedData,
          state.targetColumnName
        ),
        columnNames: Object.keys(action.updatedData[0])
      };
    default:
      return state;
  }
};

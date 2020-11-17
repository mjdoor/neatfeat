import generateStatsFromRawData from "../StatisticalFunctions/StatsGenerator";
import { castNumericColumns } from "../Utilities/ObjectUtilities";

const Types = {
  CREATE_TABLE: "CREATE_TABLE",
  UPDATE_COLUMNS: "UPDATE_COLUMNS",
  UPDATE_TABLE: "UPDATE_TABLE",
  SET_STATS_DATA: "SET_STATS_DATA"
};

const createTable = (data, targetColumnName) => {
  return async dispatch => {
    const castedData = castNumericColumns(data);
    dispatch({
      type: Types.CREATE_TABLE,
      data: castedData,
      targetColumnName
    });
    const statsData = generateStatsFromRawData(castedData, targetColumnName);
    dispatch({ type: Types.SET_STATS_DATA, statsData });
  };
};

const updateColumnNames = columns => {
  return { type: Types.UPDATE_COLUMNS, columns };
};

const updateTable = updatedData => {
  return (dispatch, getState) => {
    dispatch({ type: Types.UPDATE_TABLE, updatedData });
    // using setTimeout with 0 delay to try to get the UI to be more responsive while stats are calculating.
    // Only works to return more quickly from this function (which leads to the transformer option popup to close, but then it is still unresponsive during the calculations)
    setTimeout(() => {
      const statsData = generateStatsFromRawData(
        updatedData,
        getState().targetColumnName
      );
      dispatch({ type: Types.SET_STATS_DATA, statsData });
    }, 0);
  };
};

export default {
  createTable,
  updateColumnNames,
  updateTable,
  Types
};

import generateStatsFromRawData from "../StatisticalFunctions/StatsGenerator";
import { castNumericColumns } from "../Utilities/ObjectUtilities";

const Types = {
  CREATE_TABLE: "CREATE_TABLE",
  UPDATE_TABLE: "UPDATE_TABLE",
  SET_STATS_DATA: "SET_STATS_DATA",
  APPLY_TRANSFORMATION: "APPLY_TRANSFORMATION"
};

const createTable = (data, targetColumnName) => {
  return async dispatch => {
    const actionId = Math.random().toString(36).substr(2, 9);
    const castedData = castNumericColumns(data);
    dispatch({
      type: Types.CREATE_TABLE,
      data: castedData,
      targetColumnName,
      actionId
    });
    const statsData = await generateStatsFromRawData(
      castedData,
      targetColumnName
    );
    dispatch({ type: Types.SET_STATS_DATA, statsData, actionId });
  };
};

const applyTransformation = isTransforming => {
  return { type: Types.APPLY_TRANSFORMATION, isTransforming };
};

const updateTable = updatedData => {
  return async (dispatch, getState) => {
    const actionId = Math.random().toString(36).substr(2, 9); // get (virtually) unique id, will be used for grouping undo/redo states
    dispatch({ type: Types.UPDATE_TABLE, updatedData, actionId });
    const statsData = await generateStatsFromRawData(
      updatedData,
      getState().present.targetColumnName
    );
    dispatch({ type: Types.SET_STATS_DATA, statsData, actionId });
  };
};

export default {
  createTable,
  updateTable,
  applyTransformation,
  Types
};

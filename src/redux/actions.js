import generateStatsFromRawData from "../StatisticalFunctions/StatsGenerator";
import { castNumericColumns } from "../Utilities/ObjectUtilities";

const Types = {
  CREATE_TABLE: "CREATE_TABLE",
  UPDATE_COLUMNS: "UPDATE_COLUMNS",
  UPDATE_TABLE: "UPDATE_TABLE",
  UPDATE_GRAPH_DATA: "UPDATE_GRAPH_DATA",
  SET_STATS_DATA: "SET_STATS_DATA",
  APPLY_TRANSFORMATION: "APPLY_TRANSFORMATION",
};

const createTable = (data, targetColumnName) => {
  return async (dispatch) => {
    const castedData = castNumericColumns(data);
    dispatch({
      type: Types.CREATE_TABLE,
      data: castedData,
      targetColumnName,
    });
    const statsData = await generateStatsFromRawData(
      castedData,
      targetColumnName
    );
    dispatch({ type: Types.SET_STATS_DATA, statsData });
  };
};

const updateColumnNames = (columns) => {
  return { type: Types.UPDATE_COLUMNS, columns };
};

const applyTransformation = (isTransforming) => {
  return { type: Types.APPLY_TRANSFORMATION, isTransforming };
};

const updateTable = (updatedData) => {
  return async (dispatch, getState) => {
    dispatch({ type: Types.UPDATE_TABLE, updatedData });
    const statsData = await generateStatsFromRawData(
      updatedData,
      getState().targetColumnName
    );
    dispatch({ type: Types.SET_STATS_DATA, statsData });
  };
};

const updateGraphData = (graphData) => {
  return { type: Types.UPDATE_GRAPH_DATA, graphData };
}

export default {
  createTable,
  updateColumnNames,
  updateTable,
  updateGraphData,
  applyTransformation,
  Types,
};

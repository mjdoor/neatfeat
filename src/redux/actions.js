const Types = {
  CREATE_TABLE: "CREATE_TABLE",
  UPDATE_COLUMNS: "UPDATE_COLUMNS",
  UPDATE_TABLE: "UPDATE_TABLE",
  UPDATE_GRAPH_DATA: "UPDATE_GRAPH_DATA"
};

const createTable = (data, targetColumnName) => {
  return { type: Types.CREATE_TABLE, data, targetColumnName };
};

const updateColumnNames = columns => {
  return { type: Types.UPDATE_COLUMNS, columns };
};

const updateTable = updatedData => {
  return { type: Types.UPDATE_TABLE, updatedData };
};

const updateGraphData = (graphData) => {
  return { type: Types.UPDATE_GRAPH_DATA, graphData };
}

export default {
  createTable,
  updateColumnNames,
  updateTable,
  updateGraphData,
  Types
};

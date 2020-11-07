const Types = {
  CREATE_TABLE: "CREATE_TABLE",
  UPDATE_COLUMNS: "UPDATE_COLUMNS",
  UPDATE_TABLE: "UPDATE_TABLE",
  SCALING_NORMALIZATION_CONVERSION: "SCALING_NORMALIZATION_CONVERSION"
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

const scalingNormalization = (data, selectedColumns, option, updated) => {
  return { type: Types.SCALING_NORMALIZATION_CONVERSION, data, selectedColumns, option, updated };
}

export default {
  createTable,
  updateColumnNames,
  updateTable,
  scalingNormalization,
  Types
};

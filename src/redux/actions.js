const Types = {
  CREATE_TEST_TABLE: "CREATE_TEST_TABLE",
  CREATE_TABLE: "CREATE_TABLE",
  CHANGE_TARGET: "CHANGE_TARGET",
  UPDATE_COLUMN: "UPDATE_COLUMN",
  CREATE_TABLE: "CREATE_TABLE",
};

const createTable = (data, targetColumnName) => {
  return { type: Types.CREATE_TABLE, data, targetColumnName };
};

const updateColumn = (column) => {
  return { type: Types.UPDATE_COLUMN, column };
};

export default {
  createTable,
  updateColumn,
  Types,
};

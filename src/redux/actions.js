const Types = {
  CREATE_TEST_TABLE: "CREATE_TEST_TABLE",
  CREATE_TABLE: "CREATE_TABLE",
  CHANGE_TARGET: "CHANGE_TARGET",
  UPDATE_COLUMN: "UPDATE_COLUMN",
};

const createTestTable = () => {
  return { type: Types.CREATE_TEST_TABLE };
};

const createTable = (data) => {
  return { type: Types.CREATE_TABLE, data };
};

const changeTarget = (target) => {
  return { type: Types.CHANGE_TARGET, target };
};

const updateColumn = (column) => {
  return { type: Types.UPDATE_COLUMN, column };
};

export default {
  createTable,
  createTestTable,
  changeTarget,
  updateColumn,
  Types,
};

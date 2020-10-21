const Types = {
  CREATE_TEST_TABLE: "CREATE_TEST_TABLE",
  CREATE_TABLE: "CREATE_TABLE",
  CHANGE_TARGET: "CHANGE_TARGET",
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

export default {
  createTable,
  createTestTable,
  changeTarget,
  Types,
};

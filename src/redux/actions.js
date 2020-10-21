const Types = {
  CREATE_TEST_TABLE: "CREATE_TEST_TABLE",
  CREATE_TABLE: "CREATE_TABLE"
};

const createTestTable = () => {
  return { type: Types.CREATE_TEST_TABLE };
};

const creatingTable = data => {
  return { type: Types.CREATE_TABLE, data };
};

export default {
  creatingTable,
  createTestTable,
  Types
};

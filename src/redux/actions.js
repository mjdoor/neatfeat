const Types = {
  CREATE_TABLE: "CREATE_TABLE"
};

const createTable = (data, targetColumnName) => {
  return { type: Types.CREATE_TABLE, data, targetColumnName };
};

export default {
  createTable,
  Types
};

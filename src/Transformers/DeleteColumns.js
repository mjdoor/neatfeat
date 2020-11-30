const DeleteColumns = (data, selectedColumns) => {
  selectedColumns.forEach(featureName => {
    data.forEach(row => delete row[featureName]);
  });

  return data;
};

export default DeleteColumns;

const DeleteColumns = (data, selectedColumns) => {
  selectedColumns.forEach(featureName => {
    data.forEach(row => delete row[featureName]);
  });

  return [...data]; // duplicating array here so redux will properly update the state since it will see this as a new variable.
};

export default DeleteColumns;

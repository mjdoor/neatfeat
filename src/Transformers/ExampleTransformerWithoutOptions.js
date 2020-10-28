const ExampleTransformerWithoutOptions = (data, selectedColumns) => {
  // For this fake example, all values in selected columns are multiplied by 2
  data.forEach(row => {
    selectedColumns.forEach(columnName => {
      row[columnName] *= 2;
    });
  });

  return [...data]; // duplicating array here so redux will properly update the state since it will see this as a new variable.
};

export default ExampleTransformerWithoutOptions;

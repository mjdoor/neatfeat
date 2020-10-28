const ExampleTransformerWithOptions = (data, selectedColumns, options) => {
  // For this fake example, all values in selected columns are changed to the number stored in options
  data.forEach(row => {
    selectedColumns.forEach(columnName => {
      row[columnName] = options.option1;
    });
  });

  return [...data]; // duplicating array here so redux will properly update the state since it will see this as a new variable.
};

export default ExampleTransformerWithOptions;

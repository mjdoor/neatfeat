const NumericalMissingDataTransformer = (
  data,
  selectedColumns,
  options,
  statsData
) => {
  if (options.handlingStrategy === "delete") {
    // delete rows that have missing data for the selected features
    return data.filter(row =>
      selectedColumns
        .map(featureName => row[featureName])
        .every(val => val !== null)
    );
  } else {
    // we're imputing
    const replacementsByFeature = (() => {
      switch (options.imputeMethod) {
        case "Constant":
          return selectedColumns.reduce((acc, featureName) => {
            acc[featureName] = options.imputeConstant;
            return acc;
          }, {});

        default:
          return selectedColumns.reduce((acc, featureName) => {
            acc[featureName] = Object.keys(
              statsData.categorical.find(info => info.name === featureName)
                .data["Value Counts"]
            )[0]; // value counts are stored in an object with keys sorted by value descending, so grabbing the first key will be the most frequent categorical value
            return acc;
          }, {});
      }
    })();
    return data.map(row => {
      Object.entries(replacementsByFeature).forEach(
        ([featureName, replacement]) => {
          if (row[featureName] === null) row[featureName] = replacement;
        }
      );
      return row;
    });
  }
};

export default NumericalMissingDataTransformer;

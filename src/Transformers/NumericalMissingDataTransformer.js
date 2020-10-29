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
            acc[featureName] = statsData.numerical.find(
              info => info.name === featureName
            ).data[options.imputeMethod]; // imputeMethod should be either Mean or Median
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

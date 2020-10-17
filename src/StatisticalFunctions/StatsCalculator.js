import {
  count,
  countMissing,
  mean,
  std,
  min,
  max,
  pearsonCorr
} from "./StatsFunctions";

/*
    With rawData of the form:
    [
      {
        Feature1: value0.1,
        Feature2: value0.2,
        ...
      },
      {
        Feature1: value1.1,
        Feature2: value1.2,
        ...
      },
      ...
    ]

    Want statsData of the form: 
    [
      {
        name: Feature1,
        data: {
          min: minval,
          max: maxval,
          mean: meanval,
          ...
        }
      },
      ...
    ]
  */
const generateStatsFromRawData = (rawData, targetColumnName) => {
  const featureNames = Object.keys(rawData[0]);
  const initialColumnBuilder = featureNames.reduce((acc, featureName) => {
    acc[featureName] = [];
    return acc;
  }, {}); // builds object { Feature1: [], Feature2: [],...}
  const columns = rawData.reduce((acc, row) => {
    Object.entries(row).forEach(([featureName, value]) => {
      acc[featureName].push(value);
    });
    return acc;
  }, initialColumnBuilder);

  // grab the target column data for later use
  const targetColumn = columns[targetColumnName];

  const statsPropertyCalculations = [
    { name: "Count", func: count },
    { name: "# Missing", func: countMissing },
    { name: "Mean", func: mean },
    { name: "Min", func: min },
    { name: "Max", func: max },
    { name: "Standard Deviation", func: std },
    {
      name: "Pearson Correlation Coefficient",
      func: pearsonCorr,
      needsTargetCol: true
    }
  ];

  // still need to build Stats data using calculations...
  const tempStatsData = Object.entries(columns).map(
    ([featureName, values]) => ({
      name: featureName,
      data: statsPropertyCalculations.reduce(
        (acc, { name, func, needsTargetCol }) => {
          acc[name] = needsTargetCol
            ? func(values, [...targetColumn]) // build a copy of the targetColumn array to ensure any changes made in the function don't affect the array here
            : func(values);
          return acc;
        },
        {}
      )
    })
  );

  return tempStatsData;
};

export default generateStatsFromRawData;

import {
  NumericStatsCalculator,
  CategoricalStatsCalculator
} from "./StatsCalculators";

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
    {
     numerical: [
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
      ],
      categorical: [
        ...
      ]
    }
  */
const generateStatsFromRawData = (rawData, targetColumnName) => {
  const featureNames = Object.keys(rawData[0]);
  const initialColumnBuilder = featureNames.reduce((acc, featureName) => {
    acc[featureName] = { data: [], type: "unknown" };
    return acc;
  }, {}); // builds object { Feature1: {data: [], type: "unknown"}, Feature2: {data: [], type: "unknown"},...}
  const columns = rawData.reduce((acc, row) => {
    Object.entries(row).forEach(([featureName, value]) => {
      acc[featureName].data.push(value);
      // if value is a string, mark this feature as categorical (will override numeric type if some data in column are numeric, some are string)
      if (isNaN(value) && value !== null && value !== undefined) {
        acc[featureName].type = "categorical";
      } else if (!isNaN(value) && acc[featureName].type !== "categorical") {
        acc[featureName].type = "numeric";
      }
    });
    return acc;
  }, initialColumnBuilder); // populates column arrays { Feature1: {data: [1,2,3...], type: "numerical"}, Feature2...}

  // grab the target column data for later use
  const targetColumn = columns[targetColumnName].data;

  // separate the numeric and categorical columns
  const numeric_columns = {};
  const categorical_columns = {};
  Object.entries(columns).forEach(([featureName, column]) => {
    if (column.type === "numeric") {
      numeric_columns[featureName] = column.data;
    } else {
      categorical_columns[featureName] = column.data;
    }
  });

  const numericStatsData = Object.entries(numeric_columns).map(
    ([featureName, values]) => ({
      name: featureName,
      data: new NumericStatsCalculator(values, targetColumn).buildStatsReport()
    })
  );

  const categoricalStatsData = Object.entries(categorical_columns).map(
    ([featureName, values]) => ({
      name: featureName,
      data: new CategoricalStatsCalculator(values).buildStatsReport()
    })
  );

  return { numerical: numericStatsData, categorical: categoricalStatsData };
};

export default generateStatsFromRawData;

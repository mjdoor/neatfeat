const ScalingTransformer = (rawData, selectedColumns, statsData) => {
  selectedColumns.forEach(featureName => {
    const statsForFeature = statsData.numerical.find(
      info => info.name === featureName
    ).data;
    const min = statsForFeature["Min"];
    const max = statsForFeature["Max"];
    rawData.forEach(
      row => (row[featureName] = scale(row[featureName], min, max))
    );
  });

  return rawData;
};

const scale = (value, min, max) => {
  return (value - min) / (max - min);
};

export default ScalingTransformer;

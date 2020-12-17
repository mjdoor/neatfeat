const NormalizationTransformer = (rawData, selectedColumns, statsData) => {
  selectedColumns.forEach(featureName => {
    const statsForFeature = statsData.numerical.find(
      info => info.name === featureName
    ).data;
    const mean = statsForFeature["Mean"];
    const std = statsForFeature["Standard Deviation"];
    rawData.forEach(
      row => (row[featureName] = normalize(row[featureName], mean, std))
    );
  });

  return rawData;
};

const normalize = (value, mean, std) => {
  return (value - mean) / std;
};

export default NormalizationTransformer;

import { mean, std } from "../StatisticalFunctions/NumericStatsFormulas";

import { filterOutNull } from "../StatisticalFunctions/CategoricalStatsFormulas";

const NormalizationTransformer = (rawData, selectedColumns) => {
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
  }, initialColumnBuilder); // populates column arrays { Feature1: [1,2,3...], Feature2...}

  const selectedColumnsArr = [];
  let normalizedArr = [];

  for (let i = 0; i < selectedColumns.length; i++) {
    selectedColumnsArr.push({
      name: selectedColumns[i],
      data: columns[selectedColumns[i]]
    });
  }

  for (let i = 0; i < selectedColumnsArr.length; i++) {
    const { filteredArr } = filterOutNull(selectedColumnsArr[i].data);
    const meanForCol = mean(filteredArr);
    const stdForCol = std(filteredArr, meanForCol);
    for (let j = 0; j < selectedColumnsArr[i].data.length; j++) {
      if (selectedColumnsArr[i].data[j] === null) {
        normalizedArr.push(null);
      } else {
        normalizedArr.push(
          normalize(selectedColumnsArr[i].data[j], meanForCol, stdForCol)
        );
      }

      if (j === selectedColumnsArr[i].data.length - 1) {
        selectedColumnsArr[i].data = normalizedArr;
        normalizedArr = [];
        break;
      }
    }
  }

  for (let i = 0; i < selectedColumnsArr.length; i++) {
    rawData.forEach((row, rowIdx) => {
      row[selectedColumns[i]] = selectedColumnsArr[i].data[rowIdx];
    });
  }

  return rawData;
};

const normalize = (value, mean, std) => {
  return (value - mean) / std;
};

export default NormalizationTransformer;

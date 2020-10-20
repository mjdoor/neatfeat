export const filterNumbers = arr => {
  const removedIndices = [];
  const filteredArr = arr
    .map(el => Number(el))
    .filter((el, idx) => {
      const isNum = !Number.isNaN(el);
      if (!isNum) {
        removedIndices.push(idx);
      }
      return isNum;
    });
  return { filteredArr, removedIndices };
};

export const mean = arr => {
  return arr.reduce((sum, el) => sum + el, 0) / arr.length;
};

export const std = (arr, xMean) => {
  if (arr.length <= 1) {
    return 0;
  }

  return Math.sqrt(
    arr.reduce((sum, el) => sum + Math.pow(el - xMean, 2), 0) / (arr.length - 1) // using sample std calculation (dividing by N-1 instead of N)
  );
};

export const min = arr => {
  return Math.min(...arr);
};

export const max = arr => {
  return Math.max(...arr);
};

export const percentile = (arr, percentileVal) => {
  if (percentileVal < 0) {
    percentileVal = 0;
  } else if (percentileVal > 100) {
    percentileVal = 1;
  }

  const sortedArr = [...arr].sort((a, b) => a - b);

  let percentileIndex = ((arr.length - 1) * percentileVal) / 100.0;
  if (Number.isInteger(percentileIndex)) {
    return sortedArr[percentileIndex];
  } else {
    percentileIndex = Math.floor(percentileIndex);
    return (sortedArr[percentileIndex] + sortedArr[percentileIndex + 1]) / 2;
  }
};

export const countOutliers = (arr, q1, q3) => {
  const iqr = q3 - q1;
  const lowLimit = q1 - 1.5 * iqr;
  const highLimit = q3 + 1.5 * iqr;
  const outliers = arr.filter(el => el < lowLimit || el > highLimit);

  return outliers.length;
};

export const pearsonCorr = (dataArr, targetArr, xMean, yMean) => {
  // Perform calculation (https://www.socscistatistics.com/tests/pearson/)
  let xDiffyDiffProdSum = 0;
  let xDiffSquaredSum = 0;
  let yDiffSquaredSum = 0;

  for (let i = 0; i < dataArr.length; i++) {
    xDiffyDiffProdSum += (dataArr[i] - xMean) * (targetArr[i] - yMean);
    xDiffSquaredSum += Math.pow(dataArr[i] - xMean, 2);
    yDiffSquaredSum += Math.pow(targetArr[i] - yMean, 2);
  }

  return (
    xDiffyDiffProdSum /
    (Math.sqrt(xDiffSquaredSum) * Math.sqrt(yDiffSquaredSum))
  );
};

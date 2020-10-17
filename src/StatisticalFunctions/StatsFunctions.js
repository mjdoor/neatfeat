const filterNumbers = arr => {
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
  const { filteredArr } = filterNumbers(arr);
  return filteredArr.reduce((sum, el) => (sum += el), 0) / filteredArr.length;
};

export const min = arr => {
  const { filteredArr } = filterNumbers(arr);
  return Math.min(...filteredArr);
};

export const max = arr => {
  const { filteredArr } = filterNumbers(arr);
  return Math.max(...filteredArr);
};

export const pearsonCorr = (dataArr, targetArr) => {
  const { filteredArr, removedIndices } = filterNumbers(dataArr);
  // remove elements from targetArr that correspond to the removedIndices of the dataArr (assume targetArr doesn't have any missing values)
  for (let i = removedIndices.length - 1; i >= 0; i--) {
    targetArr.splice(removedIndices[i], 1);
  }

  console.log(filteredArr);
  console.log(targetArr);

  if (filteredArr.length !== targetArr.length) {
    console.log(
      "Error calculating Pearson Correlation Coefficient - data and target arrays have different lengths"
    );
    return NaN;
  }

  // Perform calculation (https://www.socscistatistics.com/tests/pearson/)
  const xMean = mean(filteredArr);
  const yMean = mean(targetArr);
  let xDiffyDiffProdSum = 0;
  let xDiffSquaredSum = 0;
  let yDiffSquaredSum = 0;

  for (let i = 0; i < filteredArr.length; i++) {
    xDiffyDiffProdSum += (filteredArr[i] - xMean) * (targetArr[i] - yMean);
    xDiffSquaredSum += Math.pow(filteredArr[i] - xMean, 2);
    yDiffSquaredSum += Math.pow(targetArr[i] - yMean, 2);
  }

  return (
    xDiffyDiffProdSum /
    (Math.sqrt(xDiffSquaredSum) * Math.sqrt(yDiffSquaredSum))
  );
};

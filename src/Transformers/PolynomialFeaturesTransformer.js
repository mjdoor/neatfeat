const PolynomialFeaturesTransformer = (data, selectedColumns, options) => {
  // We need to add polynomial features for all degrees from 2 up to the selected degree
  const degreesToProcess = options.availableDegrees.filter(
    d => d <= options.degree
  );

  let polynomialCombinationFeatureIndices = [];
  /**
   * The nestedForLoop function was designed to help define all combinations of selected features to provide full coverage with the new polynomial features
   * The return value from the nestedForLoop is an array of arrays, where each inner array contains the indices for which of the selectedColumns elements
   * should be multiplied together (in each row of data) to create the new polynomial feature.
   * This is done separately for each degree in degreesToProcess because the depth of the nested for loops corresponds to the degree of the polynomial features to add
   *  - different degree -> different depth
   */
  degreesToProcess.forEach(degree => {
    polynomialCombinationFeatureIndices = [
      ...polynomialCombinationFeatureIndices,
      ...nestedForLoop(degree, selectedColumns.length)
    ];
  });

  data.forEach(row => {
    polynomialCombinationFeatureIndices.forEach(indices => {
      const featureName = indices
        .map(index => selectedColumns[index])
        .join("*");
      const featureValue = indices.reduce((runningProduct, index) => {
        const val = row[selectedColumns[index]];
        return val === null || runningProduct === null
          ? null
          : runningProduct * val;
      }, 1);
      row[featureName] = featureValue;
    });
  });

  return [...data];
};

/**
 * Execute an arbitrarily deep nested for loop, where each for loop iterates up to the same limit.
 *
 * @param {Number}    depth                   The total number of for loops that will be nested together
 * @param {Number}    loopIndexExclusiveLimit The exclusive limit to which the index on each for loop will count up to
 * @param {Function}  [action]                A callback function that will run within the lowest level for loop, which accepts an array of all current for loop indices in order
 *
 * @returns {Array}                           An array containing all combinations of loop indices, as arrays, that resulted from each iteration of the nested for loops
 */
const nestedForLoop = (depth, loopIndexExclusiveLimit, action) => {
  const allLoopIndexCombinations = [];
  const recursiveLoop = (levelsToGo, ...parentLoopIndices) => {
    if (levelsToGo === 0) {
      allLoopIndexCombinations.push(parentLoopIndices);
      if (action !== undefined && typeof action === "function") {
        action(parentLoopIndices);
      }
    } else {
      const startIndex =
        parentLoopIndices.length === 0
          ? 0
          : parentLoopIndices[parentLoopIndices.length - 1];
      for (let i = startIndex; i < loopIndexExclusiveLimit; i++) {
        recursiveLoop(levelsToGo - 1, ...parentLoopIndices, i);
      }
    }
  };

  recursiveLoop(depth);

  return allLoopIndexCombinations;
};

export default PolynomialFeaturesTransformer;

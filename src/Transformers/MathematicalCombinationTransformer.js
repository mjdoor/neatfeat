import { evaluate } from "mathjs";

const MathematicalCombinationTransformer = (data, selectedColumns, options) => {
  let { expressionString, newFeatureName } = options;
  const nullIndicator = "<NULL>";
  return data.map(row => {
    // Replace the feature names in the expression string with the actual values from the row
    let expressionStringForRow = expressionString;
    selectedColumns.forEach(
      featureName =>
        (expressionStringForRow = expressionStringForRow.replace(
          new RegExp(`\\|${featureName}\\|`, "g"), // feature names are wrapped in pipes from the option component to help differentiate from functions in case the have the same name
          row[featureName] === null || row[featureName] === undefined
            ? nullIndicator
            : row[featureName]
        ))
    );
    let result = expressionStringForRow.includes(nullIndicator)
      ? null
      : evaluate(expressionStringForRow);
    if (result === Infinity || isNaN(result)) {
      result = null;
    }

    row[newFeatureName] = result;
    return row;
  });
};

export default MathematicalCombinationTransformer;

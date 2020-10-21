// converts values in columns that look like they should be numeric to numbers
export const castNumericColumns = data => {
  const featureNames = Object.keys(data[0]);
  const initialColumnBuilder = featureNames.reduce((acc, featureName) => {
    acc[featureName] = { data: [], nonNumberValues: [] };
    return acc;
  }, {});
  const columns = data.reduce((acc, row) => {
    Object.entries(row).forEach(([featureName, value]) => {
      if (Number.isNaN(Number(value))) {
        acc[featureName].nonNumberValues.push(value);
      }
      acc[featureName].data.push(value);
    });
    return acc;
  }, initialColumnBuilder); // { Feature1: {data: ['1','2','3','fish'], nonNumberValues: ['fish']}}

  console.log(columns);

  const naList = ["", "na", "n/a"];
  const columnNumericality = Object.entries(columns).reduce(
    (acc, [featureName, { data, nonNumberValues }]) => {
      acc[featureName] = false;
      // at least one number in the data
      if (data.length > nonNumberValues.length) {
        // see if all the nonNumberValues are strings that should amount to null
        if (
          nonNumberValues.filter(
            nonNum =>
              naList.findIndex(
                na => na.toLowerCase() === nonNum.toLowerCase()
              ) === -1
          ).length === 0
        ) {
          acc[featureName] = true;
        }
      }
      return acc;
    },
    {}
  );

  return data.map(row => {
    return Object.entries(row).reduce((acc, [featureName, value]) => {
      if (columnNumericality[featureName]) {
        const numVal = Number(value);
        if (Number.isNaN(numVal)) {
          acc[featureName] = null;
        } else {
          acc[featureName] = numVal;
        }
      } else {
        acc[featureName] = value;
      }
      return acc;
    }, {});
  });
};

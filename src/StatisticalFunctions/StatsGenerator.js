import {
  filterNumbers,
  mean,
  std,
  min,
  max,
  pearsonCorr,
  percentile,
  countOutliers
} from "./StatsFormulas";

class NumericStatsCalculator {
  constructor(valueArr, targetArr) {
    const { filteredArr, removedIndices } = filterNumbers(valueArr);
    this.valueArr = filteredArr;
    this.targetArr = [...targetArr]; // build a copy of the targetArr to ensure any changes made to targetArr here don't affect it outside this scope
    // remove elements from targetArr that correspond to the removedIndices of the dataArr (assume targetArr doesn't have any missing values)
    this.numMissing = removedIndices.length;
    for (let i = this.numMissing - 1; i >= 0; i--) {
      this.targetArr.splice(removedIndices[i], 1);
    }
  }

  buildStatsReport() {
    if (this.valueArr.length !== this.targetArr.length) {
      console.log("Data and target arrays have different lengths");
      return undefined;
    }

    const report = {
      Count: this.valueArr.length,
      "# Missing": this.numMissing
    };

    report["Mean"] = mean(this.valueArr);
    report["Standard Deviation"] = std(this.valueArr, report["Mean"]);
    report["Min"] = min(this.valueArr);
    report["Max"] = max(this.valueArr);
    report["1st Quartile"] = percentile(this.valueArr, 25);
    report["Median"] = percentile(this.valueArr, 50);
    report["3rd Quartile"] = percentile(this.valueArr, 75);
    report["# Outliers"] = countOutliers(
      this.valueArr,
      report["1st Quartile"],
      report["3rd Quartile"]
    );
    report["Pearson Correlation Coefficient"] = pearsonCorr(
      this.valueArr,
      this.targetArr,
      report["Mean"],
      mean(this.targetArr)
    );

    return report;
  }
}

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

  // still need to build Stats data using calculations...
  const tempStatsData = Object.entries(columns).map(
    ([featureName, values]) => ({
      name: featureName,
      data: new NumericStatsCalculator(values, targetColumn).buildStatsReport()
    })
  );

  return tempStatsData;
};

export default generateStatsFromRawData;

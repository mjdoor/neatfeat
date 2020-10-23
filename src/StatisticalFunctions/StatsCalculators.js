import {
  filterNumbers,
  mean,
  std,
  min,
  max,
  pearsonCorr,
  percentile,
  countOutliers
} from "./NumericStatsFormulas";

import { filterOutNull, valueCounts } from "./CategoricalStatsFormulas";

export class NumericStatsCalculator {
  constructor(valueArr, targetArr) {
    const { filteredArr, removedIndices } = filterOutNull(valueArr);
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

export class CategoricalStatsCalculator {
  constructor(arr) {
    const { filteredArr } = filterOutNull(arr);
    this.valueArr = filteredArr;
    this.numMissing = arr.length - this.valueArr.length;
  }

  buildStatsReport() {
    const report = {
      Count: this.valueArr.length,
      "# Missing": this.numMissing
    };

    report["Value Counts"] = valueCounts(this.valueArr);
    report["Number of Categories"] = Object.keys(report["Value Counts"]).length;

    return report;
  }
}

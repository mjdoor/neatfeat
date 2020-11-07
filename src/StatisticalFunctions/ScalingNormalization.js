import {
  filterNumbers,
  mean, 
  min,
  max,
  std
} from "./NumericStatsFormulas";

import { filterOutNull, valueCounts } from "./CategoricalStatsFormulas";
import {
  NumericStatsCalculator,
  CategoricalStatsCalculator
} from "./StatsCalculators";


export const Scaling = (arr, value) => {
  const { filteredArr, removedIndices } = filterOutNull(arr);
  const scaledValue = (value - min(filteredArr)) / (max(filteredArr) - min(filteredArr)); 
  return scaledValue
}

export const Normalization = (arr, value) => {
  const { filteredArr, removedIndices } = filterOutNull(arr);
  const normalizedValue = (value - mean(filteredArr)) / std(filteredArr, mean(filteredArr));

  return normalizedValue;
}

const generateScaledNormalizationfromRawData = (rawData, selectedColumns, option) => {
  const featureNames = Object.keys(rawData[0]);
  const initialColumnBuilder = featureNames.reduce((acc, featureName) => {
      acc[featureName] = { data: [], type: "unknown" };
      return acc;
    }, {}); // builds object { Feature1: {data: [], type: "unknown"}, Feature2: {data: [], type: "unknown"},...}
    const columns = rawData.reduce((acc, row) => {
      Object.entries(row).forEach(([featureName, value]) => {
        acc[featureName].data.push(value);
        // if value is a string, mark this feature as categorical (will override numeric type if some data in column are numeric, some are string)
        if (isNaN(value) && value !== null && value !== undefined) {
          acc[featureName].type = "categorical";
        } else if (!isNaN(value) && acc[featureName].type !== "categorical") {
          acc[featureName].type = "numeric";
        }
      });
      return acc;
    }, initialColumnBuilder); // populates column arrays { Feature1: {data: [1,2,3...], type: "numerical"}, Feature2...}

    const selectedColumnsArr = [];
    let scaledOrNormArr = [];

    for( let i = 0; i < selectedColumns.length; i++) {
      selectedColumnsArr.push({name: selectedColumns[i], data: columns[selectedColumns[i]].data});
    }

    for( let i = 0; i < selectedColumnsArr.length; i++) {
        for( let j = 0; j < selectedColumnsArr[i].data.length; j++) {
            if(option === "scaling") {
              if(selectedColumnsArr[i].data[j] === null) {
                  scaledOrNormArr.push("NA");
              }
              else {
                  scaledOrNormArr.push(Scaling(selectedColumnsArr[i].data, selectedColumnsArr[i].data[j]));
                }
            } 
            else {
              if(selectedColumnsArr[i].data[j] === null) {
                  scaledOrNormArr.push("NA");
              }
              else {
                  scaledOrNormArr.push(Normalization(selectedColumnsArr[i].data, selectedColumnsArr[i].data[j]));
              }
            }

            if(j === selectedColumnsArr[i].data.length - 1) {
                selectedColumnsArr[i].data = scaledOrNormArr;
                scaledOrNormArr = [];
                break;
            }
       }
    }


  let modifiedRawData = rawData;
  let count = 0;
  for(let i = 0; i < selectedColumnsArr.length; i++) {
      modifiedRawData.map(el => 
          {
              el[selectedColumns[i]] = selectedColumnsArr[i].data[count]; 
              count++; 
              if(count === selectedColumnsArr[i].data.length) count = 0;
          });
  }


    return { transformedData: modifiedRawData };
};

export class ScalingNormalizationConversion {
constructor(valueArr, targetArr) {
    const { filteredArr, removedIndices } = filterOutNull(valueArr);
    this.valueArr = filteredArr;
    this.targetArr = [...targetArr];
}

convertValuesScaled() {
    if(this.valueArr.length !== this.targetArr.length) {
        console.log("Data and target arrays have different lengths");
        return undefined;
    }

    return Scaling(this.valueArr);
}

convertValuesNormalized() {
  if(this.valueArr.length !== this.targetArr.length) {
      console.log("Data and target arrays have different lengths");
      return undefined;
  }

  return Normalization(this.valueArr);
}

}

export default generateScaledNormalizationfromRawData; 
const OneHotEncodingTransformation = (data, selectedColumns) => {
  var featureArr = [];

  selectedColumns.forEach(columnName => {
    var arr = [];
    data.forEach(row => {
      if (!arr.some(column => row[columnName] === column)) {
        arr.push(row[columnName]);
      }
    });
    featureArr.push({ column: columnName, values: arr });
  });

  featureArr.forEach(valueArr => {
    const column = valueArr.column;
    valueArr.values.forEach(valueName => {
      data
        .filter(r => r[column] === valueName)
        .forEach(row => {
          const oneHot = makeOneHot(valueName, valueArr);

          for (var i = 0; i < oneHot.length; i++) {
            row[column + "_" + valueArr.values[i]] = parseInt(oneHot[i]);
          }
          delete row[column];
        });
    });
  });

  return data;
};

function makeOneHot(valueName, valueArr) {
  var oneHot = "";

  // Make 0'd out string
  for (var i = 0; i < valueArr.values.length; i++) {
    oneHot += "0";
  }

  // Add 1 where the hot is
  oneHot = oneHot.replaceAt(valueArr.values.indexOf(valueName), "1");

  return oneHot;
}

String.prototype.replaceAt = function (index, replacement) {
  if (index >= this.length) {
    return this.valueOf();
  }

  return this.substring(0, index) + replacement + this.substring(index + 1);
};

export default OneHotEncodingTransformation;

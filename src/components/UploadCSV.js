import React, { useState } from "react";
import { Button } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { CSVReader, readRemoteFile } from "react-papaparse";

const UploadCSV = () => {
  //Set the position of the button.. Can be deleted if we don't want the button to move
  const [isUploaded, setIsUploaded] = useState(false);

  /*

  Raw Data => [{data,errors,meta}]

  WANTED DATA => [
    {
        Feature1: data1
        Feature2: data2
        ...
    },
    {
        Feature1: data1
        Feature2: data2
        ...
    },
    ...  
  ]

  */

  const handleOnDrop = (data) => {
    var arrData = data.map((d) => d.data);

    var result = convertToArrayOfObjects(arrData);

    console.log("---------------------------");
    console.log(result);
    console.log("---------------------------");
  };

  function convertToArrayOfObjects(data) {
    var keys = data.shift(),
      i = 0,
      k = 0,
      obj = null,
      output = [];

    for (i = 0; i < data.length; i++) {
      obj = {};

      for (k = 0; k < keys.length; k++) {
        obj[keys[k]] = data[i][k];
      }

      output.push(obj);
    }

    return output;
  }

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  return (
    <div>
      {!isUploaded && (
        <CSVReader
          onDrop={handleOnDrop}
          onError={handleOnError}
          noDrag
          style={{
            dropArea: {
              width: "10px",
              height: "10px",
              borderColor: "#fff",
              marginTop: "3.5em",
            },
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<CloudUploadIcon />}
          >
            Upload
          </Button>
        </CSVReader>
      )}
    </div>
  );
};

export default UploadCSV;

import React, { useState } from "react";
import { Button, Typography } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { CSVReader } from "react-papaparse";
import TargetSelectDialog from "./TargetSelectDialog";

const UploadCSV = () => {
  const [isUploaded, setIsUploaded] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState("");

  const handleOnDrop = data => {
    // Check if file is empty
    if (
      data[0] === undefined ||
      data[0].data === undefined ||
      data[0].data.length === 0
    ) {
      // array empty or does not exist
      console.log("EMPTY");
      setUploadError(true);
      setUploadErrorMessage("The file was empty. Please try again.");
    } else {
      // array isn't empty
      setUploadError(false);
      setUploadErrorMessage("");

      // Isolate the data
      var arrData = data.map(d => d.data);

      // Set the columns for the Target Column Select
      setColumns(arrData[0]);

      setOpen(true);

      // reset the button to reset the styling
      setIsUploaded(false);
      setIsUploaded(true);

      // Make the data into an Array of Objects with Features as the keys
      setData(convertToArrayOfObjects(arrData));
    }
  };

  const handleClose = (value, hasData, addData) => {
    setHasData(hasData);
    setOpen(false);
  };

  // Converts the array where Arr[0] is Columns and the rest are Rows into Array of Objects with Column names as the keys
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

  // For handling errors on CSVReader
  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
    setUploadError(true);
    setUploadErrorMessage(err);
  };

  return (
    <div align="center">
      <CSVReader
        onDrop={handleOnDrop}
        onError={handleOnError}
        noDrag
        accept=".csv"
        isReset={isUploaded}
        config={{ skipEmptyLines: true }}
        style={{
          dropArea: {
            width: "60px",
            height: "10px",
            borderColor: "rgba(0, 0, 0, 0)"
          }
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
      {uploadError && (
        <Typography component="p" style={{ color: "red" }}>
          {uploadErrorMessage}
        </Typography>
      )}
      {open ? (
        <TargetSelectDialog
          hasDataPassed={hasData}
          onError={handleOnError}
          isUploaded={isUploaded}
          open={open}
          onClose={handleClose}
          columns={columns}
          data={data}
        />
      ) : null}
    </div>
  );
};

export default UploadCSV;

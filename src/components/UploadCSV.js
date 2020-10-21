import React, { useState } from "react";
import { Button } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { CSVReader } from "react-papaparse";
import TargetSelectDialog from "./TargetSelectDialog";

const UploadCSV = () => {
  //Set the position of the button.. Can be deleted if we don't want the button to move
  //const [isUploaded, setIsUploaded] = useState(false);

  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const handleOnDrop = (data) => {
    // Isolate the data
    var arrData = data.map((d) => d.data);

    // Set the columns for the Target Column Select
    setColumns(arrData[0]);
    setOpen(true);

    // Make the data into an Array of Objects with Features as the keys
    setData(convertToArrayOfObjects(arrData));
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
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
  };

  return (
    <div style={{ marginBottom: "1em", padding: "1em" }}>
      <CSVReader
        onDrop={handleOnDrop}
        onError={handleOnError}
        noDrag
        style={{
          dropArea: {
            width: "10px",
            height: "10px",
            borderColor: "#fff",
            marginTop: "3em",
            display: "inline-block",
          },
          height: "1em",
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
      <TargetSelectDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        columns={columns}
        data={data}
      />
    </div>
  );
};

export default UploadCSV;
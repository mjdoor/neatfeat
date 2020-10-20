import React, { useState } from "react";
import { Typography, Paper, Button } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { CSVReader, readRemoteFile } from "react-papaparse";
import { Papa } from "papaparse";

const Homepage = () => {
  const [isUploaded, setIsUploaded] = useState(false);

  const handleOnFileLoad = (data) => {
    // readRemoteFile(
    //   "https://raw.githubusercontent.com/loganSovereign/TestFiles/main/train.csv",
    //   {
    //     complete: (results) => {
    //       var arrayOfData = results.data;
    //     },
    //   }
    // );
  };
  const handleOnDrop = (data) => {
    console.log("---------------------------");
    console.log(data);
    console.log("---------------------------");
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  return (
    <div style={{ padding: 10 }} align="center">
      <AppBar>
        <Toolbar>
          <Typography color="secondary" align="left" noWrap variant="h4">
            Neat Feat
          </Typography>
        </Toolbar>
      </AppBar>
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
              marginRight: "2em",
              float: "right",
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

export default Homepage;

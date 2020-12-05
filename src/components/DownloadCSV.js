import React from "react";
import { useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { CSVLink } from "react-csv";

const DownloadCSV = () => {
  const { rawData } = useSelector(state => state.present);

  return (
    <div align="center">
      {rawData.length !== 0 && (
        <CSVLink
          style={{ textDecoration: "none" }}
          data={rawData}
          target="_blank"
          filename={"cleaned_data.csv"}
        >
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<CloudDownloadIcon />}
          >
            Download
          </Button>
        </CSVLink>
      )}
    </div>
  );
};

export default DownloadCSV;

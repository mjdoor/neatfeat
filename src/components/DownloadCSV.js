import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { useSelector } from "react-redux";
import { CSVLink } from "react-csv";

const DownloadCSV = () => {
    const { rawData } = useSelector(state => state);

return (
    <div style={{marginTop: "1rem"}}>
        <CSVLink  className="csvDownloadLink"
            data={rawData} 
            target="_blank" 
            filename={'cleaned_data.csv'} >
            Download cleaned data
        </CSVLink>
    </div>
    )
}

export default DownloadCSV;
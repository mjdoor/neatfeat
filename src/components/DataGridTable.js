import React, { useEffect } from "react";
import DataGrid from "react-data-grid";
import "react-data-grid/dist/react-data-grid.css";
import { useSelector } from "react-redux";
//import { DataGrid } from "@material-ui/data-grid";

const DataGridTable = () => {
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const { rawData, rawColumn } = useSelector((state) => state);

  useEffect(() => {
    if (rawData.length > 15) {
      var columnOutputData = rawColumn.map(function (x) {
        return {
          key: x,
          name: x,
        };
      });
      setColumns(columnOutputData);
      setRows(rawData);
    }
  }, [rawData, rawColumn]);

  return (
    <div style={{ padding: 10 }}>
      {columns != undefined && <DataGrid columns={columns} rows={rows} />}
    </div>
  );
};

export default DataGridTable;

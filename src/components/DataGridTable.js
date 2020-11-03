import React, { useEffect } from "react";
//import DataGrid from "react-data-grid";
import "react-data-grid/dist/react-data-grid.css";
import { useSelector } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { countOutliers } from "../StatisticalFunctions/NumericStatsFormulas";
import { DataGrid } from "@material-ui/data-grid";

const DataGridTable = () => {
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const { rawData, columnNames } = useSelector((state) => state);

  useEffect(() => {
    if (
      rawData !== undefined &&
      rawData.length > 0 &&
      columnNames !== undefined &&
      columnNames.length > 0
    ) {
      const columnOutputData = columnNames.map((colName) => {
        return {
          field: colName,
          headerName: colName,
          width: 150,
        };
      });
      const rawDataWithIds = rawData[0].hasOwnProperty("id")
        ? rawData
        : rawData.map((row, idx) => {
            return { id: idx, ...row };
          });

      setColumns(columnOutputData);
      setRows(rawDataWithIds);
    }
  }, [rawData, columnNames]);

  return (
    <div style={{ height: "400px", marginBottom: "50px" }}>
      {columns.length > 0 && (
        <div>
          <div style={{ marginTop: "10px", height: "400px" }}>
            <DataGrid columns={columns} rows={rows} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataGridTable;

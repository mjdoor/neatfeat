import React, { useEffect } from "react";
import DataGrid from "react-data-grid";
import "react-data-grid/dist/react-data-grid.css";
import { useSelector } from "react-redux";
//import { DataGrid } from "@material-ui/data-grid";

const DataGridTable = () => {
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const { rawData, rawColumn } = useSelector(state => state);

  useEffect(() => {
    if (
      rawData !== undefined &&
      rawData.length > 0 &&
      rawColumn !== undefined &&
      rawColumn.length > 0
    ) {
      const columnOutputData = rawColumn.map(colName => {
        return {
          key: colName,
          name: colName
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
  }, [rawData, rawColumn]);

  return (
    <div style={{ padding: 10 }}>
      {columns.length > 0 && <DataGrid columns={columns} rows={rows} />}
    </div>
  );
};

export default DataGridTable;

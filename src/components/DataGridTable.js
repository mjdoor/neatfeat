import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import { roundNum } from "../Utilities/NumberUtilities";

const DataGridTable = () => {
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const { rawData, columnNames } = useSelector(state => state);

  useEffect(() => {
    if (
      rawData !== undefined &&
      rawData.length > 0 &&
      columnNames !== undefined &&
      columnNames.length > 0
    ) {
      const columnOutputData = columnNames.map(colName => {
        return {
          field: colName,
          headerName: colName,
          width: 150,
          valueFormatter: ({ value }) => roundNum(value, 2)
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
    <div style={{ height: "400px", marginBottom: "50px", padding: 10 }}>
      {columns.length > 0 && (
        <div>
          <div style={{ marginTop: "10px", height: "400px" }}>
            <DataGrid
              columns={columns}
              rows={rows}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              pageSize={5}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataGridTable;

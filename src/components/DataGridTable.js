import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const DataGridTable = () => {
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const { rawData, columnNames } = useSelector(state => state);
  const [deletedRows, setDeletedRows] = React.useState([]);
  const [msg, setMsg] = React.useState("");

  const handleRowSelection = e => {
    console.log("row selected");
    setDeletedRows([...deletedRows, ...rows.filter(r => r.id === e.data.id)]);
  };

  const deleteRows = () => {
    console.log("delete button");
    console.log(deletedRows.length);
    setMsg(deletedRows.length + " rows deleted.");
    setRows(
      rows.filter(r => deletedRows.filter(sr => sr.id === r.id).length < 1)
    );
  };

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
          width: 150
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
    <div style={{ height: "400px", marginBottom: "100px", padding: 10 }}>
      {columns.length > 0 && (
        <div>
          <IconButton
            aria-label="delete"
            color="secondary"
            onClick={() => deleteRows()}
          >
            <DeleteIcon />
          </IconButton>
          <p style={{ fontWeight: "bolder" }}>{msg}</p>
          <div />
          <div style={{ marginTop: "30px", height: "400px" }}>
            <DataGrid
              columns={columns}
              rows={rows}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              pageSize={5}
              checkboxSelection
              onRowSelected={handleRowSelection}
              disableSelectionOnClick
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataGridTable;

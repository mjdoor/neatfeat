import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { roundNum } from "../Utilities/NumberUtilities";
import ACTIONS from "../redux/actions";

const DataGridTable = () => {
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const { rawData, columnNames } = useSelector((state) => state);
  const [deletedRows, setDeletedRows] = React.useState([]);
  const [msg, setMsg] = React.useState("");
  const [btnSwitch, setBtnSwitch] = React.useState(true);
  const dispatch = useDispatch();

  const handleRowSelection = (e) => {
    setMsg("");
    if (e.isSelected === true) {
      console.log("select: " + e.data.id);
      setDeletedRows([
        ...deletedRows,
        ...rows.filter((r) => r.id === e.data.id),
      ]);
    } else if (e.isSelected === false) {
      console.log("unselect: " + e.data.id);
      delete deletedRows[e.data.id];
    }
    setBtnSwitch(false);
  };

  const deleteRows = () => {
    if (rawData[0].hasOwnProperty("id")) {
      let dataFiltered = rawData;
      deletedRows.sort();
      setDeletedRows(deletedRows.reverse());
      deletedRows.forEach((selected) => {
        // alert(selected.id);
        dataFiltered = dataFiltered.filter((r) => r.id !== selected.id);
      });
      dispatch(ACTIONS.updateTable(dataFiltered));
    } else {
      setDeletedRows(deletedRows.sort((a, b) => b.id - a.id));
      deletedRows.forEach((selected) => {
        rawData.splice(selected.id, 1);
        dispatch(ACTIONS.updateTable(rawData));
      });
    }

    setDeletedRows([]);
    setMsg(deletedRows.length + " rows deleted.");
    setBtnSwitch(true);
  };

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
          valueFormatter: ({ value }) => roundNum(value, 3),
        };
      });
      const rawDataWithIds = rawData[0].hasOwnProperty("id")
        ? rawData
        : rawData.map((row, idx) => {
            //     console.log("RAW DATA  BEFORE: " + row.Id);
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
            disabled={btnSwitch}
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

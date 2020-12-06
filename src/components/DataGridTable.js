import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { roundNum } from "../Utilities/NumberUtilities";
import ACTIONS from "../redux/actions";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  fadingOut: {
    opacity: 0,
    transition: "all 250ms linear"
  }
}));

let fadingTimeout = null;

const DataGridTable = () => {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const { rawData, columnNames } = useSelector(state => state);
  const [deletedRows, setDeletedRows] = useState([]);
  const [msg, setMsg] = useState("");
  const [hideMsg, setHideMsg] = useState(false);
  const dispatch = useDispatch();

  const classes = useStyles();

  const handleRowSelection = e => {
    setMsg("");
    setHideMsg(false);
    if (e.isSelected === true) {
      setDeletedRows(prevDeletedRows => [
        ...prevDeletedRows,
        rows.find(r => r.id === e.data.id)
      ]);
    } else if (e.isSelected === false) {
      setDeletedRows(prevDeletedRows =>
        prevDeletedRows.filter(r => r.id !== e.data.id)
      );
    }
  };

  const deleteRows = () => {
    if (rawData[0].hasOwnProperty("id")) {
      let dataFiltered = rawData;
      deletedRows.forEach(selected => {
        dataFiltered = dataFiltered.filter(r => r.id !== selected.id);
      });
      dispatch(ACTIONS.updateTable(dataFiltered));
    } else {
      setDeletedRows(deletedRows.sort((a, b) => b.id - a.id));
      deletedRows.forEach(selected => {
        rawData.splice(selected.id, 1);
        dispatch(ACTIONS.updateTable(rawData));
      });
    }

    setDeletedRows([]);

    if (fadingTimeout !== null) {
      clearTimeout(fadingTimeout);
    }
    setMsg(
      `${deletedRows.length} row${deletedRows.length === 1 ? "" : "s"} deleted.`
    );
    fadingTimeout = setTimeout(() => {
      setHideMsg(true);
    }, 2000);
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
          width: 150,
          valueFormatter: ({ value }) => roundNum(value, 3)
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
          <Grid component="div" container alignItems="flex-end">
            <IconButton
              aria-label="delete"
              color="secondary"
              onClick={() => deleteRows()}
              disabled={deletedRows.length === 0}
            >
              <DeleteIcon />
            </IconButton>
            <p
              style={{
                fontWeight: "bolder",
                display: "inline",
                paddingLeft: 10,
                paddingBottom: 13.5,
                margin: 0
              }}
              className={hideMsg ? classes.fadingOut : ""}
            >
              {msg}
            </p>
          </Grid>
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

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { roundNum } from "../Utilities/NumberUtilities";
import ACTIONS from "../redux/actions";
import { Grid, Typography } from "@material-ui/core";

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
  const { rawData, columnNames } = useSelector(state => state.present);
  const [deletedRows, setDeletedRows] = useState([]);
  const [msg, setMsg] = useState("");
  const [hideMsg, setHideMsg] = useState(false);
  const dispatch = useDispatch();

  const classes = useStyles();

  const handleRowSelection = e => {
    setMsg("");
    setHideMsg(false);
    if (e.isSelected === true) {
      setDeletedRows(prevDeletedRows => [...prevDeletedRows, e.data.id]);
    } else if (e.isSelected === false) {
      setDeletedRows(prevDeletedRows =>
        prevDeletedRows.filter(rId => rId !== e.data.id)
      );
    }
  };

  const deleteRows = () => {
    if (rawData[0].hasOwnProperty("id")) {
      // in this case, the ids for the deleted rows will be values corresponding wit the id key in each row of rawData, so just filter them out
      dispatch(
        ACTIONS.updateTable(
          rawData.filter(row => !deletedRows.includes(row.id))
        )
      );
    } else {
      // in this case, the id will represent the index of the row within rawData (as set in useEffect), so just filter using index
      dispatch(
        ACTIONS.updateTable(
          rawData.filter((_row, idx) => !deletedRows.includes(idx))
        )
      );
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
    <div style={{ height: 400, marginBottom: 40, padding: 10 }}>
      {rawData.length > 0 && (
        <Grid container>
          <Grid item xs={"auto"} style={{ position: "relative", minWidth: 40 }}>
            <Typography
              component="div"
              style={{
                position: "absolute",
                width: 200,
                top: "40%",
                left: "50%",
                transform: "translateX(-50%) translateY(-50%) rotate(-90deg)",
                fontWeight: "bold",
                fontSize: 30
              }}
            >
              Raw Data
            </Typography>
          </Grid>
          <Grid item xs>
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

              <div style={{ marginTop: 5, height: "400px" }}>
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
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default DataGridTable;

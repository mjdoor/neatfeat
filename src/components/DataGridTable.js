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

  const updateData = (transformedData) => {
    dispatch(ACTIONS.updateTable(transformedData));
  };

  const handleRowSelection = (e) => {
    console.log("row selected");
    setDeletedRows([...deletedRows, ...rows.filter((r) => r.id === e.data.id)]);
    setBtnSwitch(false);
  };

  const deleteRows = () => {
    //console.log("delete button");
    console.log(deletedRows.length);
    setMsg(deletedRows.length + " rows deleted.");
    setRows(
      rows.filter((r) => deletedRows.filter((sr) => sr.id === r.id).length < 1)
    );
    setDeletedRows([]);
    setBtnSwitch(true);
    var deleted = [];

    deletedRows.forEach((item) => {
      console.log("ID: " + item.id);
      rawData.map((r) => {
        if (item.id + 1 === r.Id) delete r[item.id + 1];
      });

      // deleted = rawData.filter((rd) => rd.Id === item.id + 1);

      // delete rawData[item.id + 1];
    });

    // updateData(rawData);
    console.log("RAW DATA: " + rawData.length);
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
            return { id: idx, ...row };
          });
      console.log("RAW DATA  BEFORE: " + rawData.length);
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

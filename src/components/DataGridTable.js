import React from "react";
import { Typography, Paper } from "@material-ui/core";
import DataGrid from "react-data-grid";
import "react-data-grid/dist/react-data-grid.css";

//sample data
import { readRemoteFile } from "react-papaparse";

const DataGridTable = () => {
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  var arrayOfData = [];
  const TransformData = async () => {
    var columns = [];
    var rowsData;
    readRemoteFile(
      "https://raw.githubusercontent.com/loganSovereign/TestFiles/main/train.csv",
      {
        complete: (results) => {
          arrayOfData = results.data;
          columns = results.data.slice(0, 1)[0];
          rowsData = results.data.slice(1);
          var columnOutput = columns.map(function (x) {
            return {
              key: x,
              name: x,
            };
          });
          setColumns(columnOutput);
          var arrayOfObjects = [];
          for (var i = 0; i < rowsData.length; i++) {
            var obj = {};
            for (var j = 0; j < rowsData[i].length; j++) {
              obj[columns[j]] = rowsData[i][j];
            }
            arrayOfObjects.push(obj);
          }
          setRows(arrayOfObjects);

          //console.log(arrayOfObjects);
        },
      }
    );
  };
  TransformData();
  return (
    <div style={{ padding: 10 }}>
      <Paper
        elevation={3}
        style={{
          width: "min-content",
          margin: "0 auto",
          padding: 20,
          marginTop: 30,
        }}
        align="center"
      >
        <Typography variant="h3" color="primary" align="center" noWrap>
          Data grid
        </Typography>
      </Paper>
      <rows></rows>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        disableSelectionOnClick
        onCellHover={(cellParams) => console.log(cellParams)}
      />
    </div>
  );
};

export default DataGridTable;

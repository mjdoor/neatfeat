import React from "react";
import { Typography, Paper } from "@material-ui/core";
import Papa from "papaparse/papaparse.min.js";
import DataGrid from "react-data-grid";
import "react-data-grid/dist/react-data-grid.css";
//sample data
import train from "../data/train.csv";
import { readRemoteFile } from "react-papaparse";
import { CsvToHtmlTable } from "react-csv-to-table";

//const columns = [
//  { key: "id", name: "ID" },
//  { key: "title", name: "Title" },
//];

//const rows = [
//  { id: 0, title: "Example" },
//  { id: 1, title: "Demo" },
//];

const DataGridTable = () => {
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  /*
  const ReadData = async () => {
    const response = await fetch(train);
    const reader = response.body.getReader();
    const result = await reader.read(); // raw array
    const decoder = new TextDecoder("utf-8");
    const csv = decoder.decode(result.value);

    Papa.parse(csv, {
      complete: function (results) {
        //  console.log("Finished:", results.data);
        setColumns(results.data.splice(0, 1)[0]);
        setRows(results.data.slice(1));
        //  console.log("ROWS" + results.data.slice(1));
      },
    });
  };
*/

  /*
  const TransformData = async () => {
    var arrayOfData = [];
    var columns = [];
    var rows;
    // await ReadData();
    readRemoteFile(
      "https://raw.githubusercontent.com/loganSovereign/TestFiles/main/train.csv",
      {
        complete: (results) => {
          arrayOfData = results.data;
          //  columns = Object.assign({}, results.data.slice(1));
          //  rows = Object.assign({}, results.data.splice(0, 1)[0]);
          columns = results.data.slice(0, 1)[0];
          rows = results.data.slice(1);

          // setColumns(columns);
          // setRows(rows);
          // console.log(columns);
          var columnOutput = columns.map(function (x) {
            return {
              id: x,
              name: x,
            };
          });

          var rowO = columns.map(function (x) {
              var name = x.id;
            rows.map(function(y) {
              return{
                name: y
              }

            })
            
          })


          var rowOutput = rows.map(function (y) {
            var i = 0;
            return {
              id: i,
              title: y,
            };
            i++;
          });
          console.log(rowOutput);
          setColumns(columnOutput);
          setRows(rowOutput);
        },
      }
    );

    const c = columns.map((item) => {
      item["name"] = item.value;
    });
  };
*/
  const sampleData = train.toString();
  // ReadData();
  // TransformData();
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
      <DataGrid columns={columns} rows={rows} rowsCount={5} />
      <CsvToHtmlTable
        data={sampleData}
        csvDelimiter=","
        tableClassName="table table-striped table-hover"
      />
    </div>
  );
};

export default DataGridTable;

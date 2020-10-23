import React from "react";
import DataGrid from "react-data-grid";
import "react-data-grid/dist/react-data-grid.css";
import { useSelector } from "react-redux";
//import { DataGrid } from "@material-ui/data-grid";

const DataGridTable = () => {
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  var arrayOfData = [];
  var arrayOfColumns = [];
  const { rawData, rawColumn } = useSelector((state) => state);

  const TransformData = async () => {
    arrayOfData = await rawData;
    arrayOfColumns = await rawColumn;

    var columnOutputData = await arrayOfColumns.map(function (x) {
      return {
        key: x,
        name: x,
      };
    });
    console.log(arrayOfData);
    //console.log(columnOutput.entries());

    //setColumns(columnOutputData);
    setRows(arrayOfData);

    console.log(arrayOfData);
  };
  TransformData();

  return (
    <div style={{ padding: 10 }}>
      {columns != undefined && (
        <DataGrid
          columns={columns}
          rows={rows}
          // checkboxSelection
          // disableSelectionOnClick
          // onCellHover={(cellParams) => console.log(cellParams)}
        />
      )}
    </div>
  );
};

export default DataGridTable;

import React from "react";
import DataGrid from "react-data-grid";
import "react-data-grid/dist/react-data-grid.css";
import { useSelector } from "react-redux";

const DataGridTable = () => {
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  var arrayOfData = [];
  var arrayOfColumns = [];
  const { rawData, rawColumn } = useSelector((state) => state);

  const TransformData = async () => {
    arrayOfData = await rawData;
    setRows(arrayOfData);
    arrayOfColumns = await rawColumn;

    var columnOutput = [];

    for (var [key, value] in arrayOfColumns) {
      // console.log("KEY: " + arrayOfColumns[key]);
      columnOutput.push({
        key: arrayOfColumns[key],
        name: arrayOfColumns[key],
      });
    }
    console.log(columnOutput);
    setColumns(columnOutput);
    console.log(arrayOfColumns);
  };
  TransformData();

  return (
    <div style={{ padding: 10 }}>
      {columns != undefined && (
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          disableSelectionOnClick
          onCellHover={(cellParams) => console.log(cellParams)}
        />
      )}
    </div>
  );
};

export default DataGridTable;

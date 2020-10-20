import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";

import { roundNum } from "../../Utilities/NumberUtilities";

const StatisticsTable = props => {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (props.numerical) {
      setRows(
        props.statsData.numerical.map((row, idx) => ({
          id: idx,
          featureName: row.name,
          ...row.data
        }))
      );
      setColumns([
        { field: "featureName", headerName: "Feature", width: 150 },
        ...Object.keys(props.statsData.numerical[0].data).map(key => ({
          field: key,
          headerName: key,
          width: (() => {
            if (key.length > 20) {
              return 250;
            } else if (key.length > 15) {
              return 200;
            } else if (key.length > 10) {
              return 150;
            } else {
              return 100;
            }
          })(), // just hacky to get decent column widths quickly
          valueFormatter: ({ value }) => roundNum(value, 2)
        }))
      ]);
    } else {
      setRows(
        props.statsData.categorical.map((row, idx) => ({
          id: idx,
          featureName: row.name,
          ...row.data
        }))
      );
      setColumns([
        { field: "featureName", headerName: "Feature", width: 150 },
        ...Object.keys(props.statsData.categorical[0].data)
          .filter(key => key !== "Value Counts")
          .map(key => ({
            field: key,
            headerName: key,
            width: (() => {
              if (key.length > 20) {
                return 250;
              } else if (key.length > 15) {
                return 200;
              } else if (key.length > 10) {
                return 150;
              } else {
                return 100;
              }
            })(), // just hacky to get decent column widths quickly
            valueFormatter: ({ value }) => roundNum(value, 2)
          })),
        {
          field: "Value Counts",
          headerName: "Value Counts",
          width: 150,
          renderCell: params => {
            const [firstCatName, firstCatCount] = Object.entries(
              params.value
            )[0];
            return <span>{`${firstCatName}: ${firstCatCount} ...`}</span>;
          }
        }
      ]);
    }
  }, [props.numerical, props.statsData]);

  return (
    <div style={{ height: "400px" }}>
      {rows.length > 0 && columns.length > 0 && (
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          disableSelectionOnClick
          onCellHover={cellParams => console.log(cellParams)}
        />
      )}
    </div>
  );
};

export default StatisticsTable;

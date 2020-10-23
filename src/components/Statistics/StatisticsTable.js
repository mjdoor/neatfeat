import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import ValueCountsTooltip from "./ValueCountsTooltip";

import { roundNum } from "../../Utilities/NumberUtilities";
import { Typography } from "@material-ui/core";

const StatisticsTable = (props) => {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const dataToShow = props.numerical
      ? props.statsData.numerical
      : props.statsData.categorical;

    if (dataToShow.length === 0) {
      setRows([]);
      setColumns([]);
    } else {
      setRows(
        dataToShow.map((row, idx) => ({
          id: idx,
          featureName: row.name,
          ...row.data,
        }))
      );
      const cols = [
        { field: "featureName", headerName: "Feature", width: 150 },
        ...Object.keys(dataToShow[0].data)
          .filter((key) => key !== "Value Counts") // Value Counts will be handled separately
          .map((key) => ({
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
            valueFormatter: ({ value }) => roundNum(value, 2),
          })),
      ];

      if (!props.numerical) {
        cols.push({
          field: "Value Counts",
          headerName: "Value Counts",
          width: 150,
          renderCell: (params) => {
            const [firstCatName, firstCatCount] = Object.entries(
              params.value
            )[0];
            return (
              <ValueCountsTooltip valueCounts={Object.entries(params.value)}>
                <span>{`${firstCatName}: ${firstCatCount} ...`}</span>
              </ValueCountsTooltip>
            );
          },
        });
      }

      setColumns(cols);
    }
  }, [props.numerical, props.statsData]);

  return (
    <div style={{ height: "400px" }}>
      {rows.length > 0 && columns.length > 0 ? (
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          disableSelectionOnClick
          onSelectionChange={(selectionParams) =>
            props.onSelectionChange(
              selectionParams.rows.map((rw) => rw.featureName)
            )
          }
        />
      ) : (
        <Typography component="p">
          No {props.numerical ? "numerical" : "categorical"} data to show.
        </Typography>
      )}
    </div>
  );
};

export default StatisticsTable;

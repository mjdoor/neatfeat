import React, { useEffect } from "react";
import DataGrid from "react-data-grid";
import "react-data-grid/dist/react-data-grid.css";
import { useSelector } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { countOutliers } from "../StatisticalFunctions/NumericStatsFormulas";
//import { DataGrid } from "@material-ui/data-grid";

const DataGridTable = () => {
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const { rawData, columnNames } = useSelector((state) => state);

  useEffect(() => {
    if (
      rawData !== undefined &&
      rawData.length > 0 &&
      columnNames !== undefined &&
      columnNames.length > 0
    ) {
      const columnOutputData = columnNames.map((colName) => {
        return {
          key: colName,
          name: colName,
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
    <div style={{ padding: 10, height: "400px" }}>
      {columns.length > 0 && (
        <div>
          <div style={{ marginLeft: "80%" }}>
            <DropdownButton
              id="dropdown-basic-button"
              variant="secondary"
              title="Number of Rows"
              size="sm"
              style={{ marginBottom: "10px" }}
            >
              <Dropdown.Item
                onSelect={() => {
                  setCount(rows.length);
                }}
              >
                All
              </Dropdown.Item>
              <Dropdown.Item
                onSelect={() => {
                  setCount(25);
                }}
              >
                25
              </Dropdown.Item>
              <Dropdown.Item
                onSelect={() => {
                  setCount(50);
                }}
              >
                50
              </Dropdown.Item>
              <Dropdown.Item
                onSelect={() => {
                  setCount(100);
                }}
              >
                100
              </Dropdown.Item>
              <Dropdown.Item
                onSelect={() => {
                  setCount(150);
                }}
              >
                150
              </Dropdown.Item>
            </DropdownButton>
          </div>
          <div style={{ marginTop: "10px" }}>
            <DataGrid columns={columns} rows={rows} rowsCount={count} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataGridTable;

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {
  BarChart,
  ScatterChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter
} from "recharts";
import { max } from "../StatisticalFunctions/NumericStatsFormulas";

const CustomTooltip = ({
  active,
  payload,
  label,
  xAxisColumn,
  yAxisColumn
}) => {
  if (active) {
    return (
      <div>
        <p>{`${xAxisColumn} : ${label}`}</p>
        {payload.length !== 0 && (
          <p>{`${yAxisColumn} : ${payload[0].value}`}</p>
        )}
      </div>
    );
  }
  return null;
};

const ChartDialog = props => {
  const {
    onClose,
    selectedChart,
    open,
    rawData,
    xAxisColumn,
    yAxisColumn,
    bucketSize,
    numOfNull,
    newDataForHistogram,
    bucketsArr
  } = props;

  const [histogramData, setHistogramData] = useState([]);

  useEffect(() => {
    if (newDataForHistogram !== undefined && bucketSize > 0) {
      let histogramDataArr = {};

      for (let i = 0; i < bucketsArr.length - 1; i++) {
        histogramDataArr[`${bucketsArr[i]} - ${bucketsArr[i + 1]}`] = 0;
      }

      const maxValue = max(newDataForHistogram);

      newDataForHistogram.forEach(s => {
        for (let i = 0; i < bucketsArr.length - 1; i++) {
          if (i === bucketsArr.length - 2 && s === maxValue) {
            histogramDataArr[`${bucketsArr[i]} - ${bucketsArr[i + 1]}`]++;
            break;
          }

          if (between(s, bucketsArr[i], bucketsArr[i + 1])) {
            histogramDataArr[`${bucketsArr[i]} - ${bucketsArr[i + 1]}`]++;
            break;
          }
        }
      });

      let tempUsableData = [];
      for (var bucket in histogramDataArr) {
        tempUsableData.push({
          [xAxisColumn]: bucket,
          count: histogramDataArr[bucket]
        });
      }

      setHistogramData(tempUsableData);
    }
    // eslint-disable-next-line
  }, [newDataForHistogram, bucketSize, xAxisColumn]);

  const between = (x, min, max) => {
    return x >= min && x <= max;
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle>
        Chart
        <IconButton aria-label="Close" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent align="center">
        {(() => {
          switch (selectedChart) {
            case "ScatterChart":
              return (
                <ScatterChart
                  width={600}
                  height={300}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid />
                  <XAxis
                    domain={["dataMin", "dataMax"]}
                    label={{
                      value: xAxisColumn,
                      position: "insideBottomRight"
                    }}
                    type="number"
                    dataKey={xAxisColumn}
                    name={xAxisColumn}
                  />
                  <YAxis
                    label={{
                      value: yAxisColumn,
                      angle: -90,
                      position: "insideLeft"
                    }}
                    type="number"
                    dataKey={yAxisColumn}
                    name={yAxisColumn}
                  />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Legend />
                  <Scatter
                    name="Median"
                    data={rawData}
                    fill="#8884d8"
                    shape="circle"
                  />
                </ScatterChart>
              );
            case "Histogram":
              return (
                <div>
                  <BarChart
                    width={600}
                    height={300}
                    data={histogramData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                    <XAxis
                      domain={["dataMin", "dataMax"]}
                      label={{
                        value: xAxisColumn,
                        position: "insideBottomRight"
                      }}
                      dataKey={xAxisColumn}
                    />
                    <YAxis
                      label={{
                        value: "Count",
                        angle: -90,
                        position: "insideLeft"
                      }}
                    />
                    <Tooltip
                      content={
                        <CustomTooltip
                          xAxisColumn={xAxisColumn}
                          yAxisColumn="count"
                        />
                      }
                    />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                  <DialogContentText>
                    Number of Null Values: {numOfNull}
                  </DialogContentText>
                </div>
              );
          }
        })()}
      </DialogContent>
    </Dialog>
  );
};

export default ChartDialog;

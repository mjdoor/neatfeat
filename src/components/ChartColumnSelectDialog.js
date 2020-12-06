import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  DialogContent,
  DialogContentText,
  Button
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ChartDialog from "./ChartDialog";
import { useSelector, useDispatch } from "react-redux";
import ACTIONS from "../redux/actions";
import { min, max } from "../StatisticalFunctions/NumericStatsFormulas";

const ChartColumnSelectDialog = props => {
  const { onClose, selectedChart, open, selectedFeatures, rawData } = props;

  const dispatch = useDispatch();
  const { targetColumnName } = useSelector(state => state);

  const [chartSelectOpen, setChartSelectOpen] = useState(false);
  const [xAxisColumn, setXAxisColumn] = useState("");
  const [yAxisColumn, setYAxisColumn] = useState("");
  const [showDropboxes, setShowDropboxes] = useState(false);
  const [showHistogram, setShowHistogram] = useState(false);
  const [includeTargetColumn, setIncludeTargetColumn] = useState(false);
  const [recommendedBucketSize, setRecommenedBucketSize] = useState(0);
  const [bucketSize, setBucketSize] = useState(0);
  const [bucketSizes, setBucketSizes] = useState([]);
  const [numOfNull, setNumOfNull] = useState(0);
  const [newDataForHistogram, setNewDataForHistogram] = useState([]);
  const [bucketsArr, setBucketsArr] = useState([]);

  useEffect(() => {
    setIncludeTargetColumn(false);
    if (
      selectedFeatures.length > 2 ||
      selectedFeatures.length === 0 ||
      selectedChart === ""
    ) {
      setShowDropboxes(false);
      setShowHistogram(false);
    } else {
      if (selectedChart === "ScatterChart") {
        if (
          selectedFeatures.length === 1 &&
          selectedFeatures[0] !== targetColumnName
        ) {
          setIncludeTargetColumn(true);
          setYAxisColumn(targetColumnName);
          setShowDropboxes(true);
          setShowHistogram(false);
        } else if (
          selectedFeatures.length === 1 &&
          selectedFeatures[0] === targetColumnName
        ) {
          setShowDropboxes(false);
          setShowHistogram(false);
        } else {
          setShowDropboxes(true);
          setShowHistogram(false);
        }
      } else {
        if (selectedFeatures.length !== 1) {
          setShowDropboxes(false);
          setShowHistogram(false);
        } else {
          setShowHistogram(true);
          setShowDropboxes(false);

          if (rawData !== undefined && selectedChart === "Histogram") {
            //for histogram
            const dataForHistogram = rawData.map(
              row => row[selectedFeatures[0]]
            );
            const removedIndices = [];
            const filteredArr = dataForHistogram.filter((el, idx) => {
              const keep = el !== null && el !== undefined;
              if (!keep) {
                removedIndices.push(idx);
              }
              return keep;
            });
            setNumOfNull(removedIndices.length);
            setNewDataForHistogram(filteredArr);
            const difference = max(filteredArr) - min(filteredArr);
            let recommendedBucSize = Math.floor(difference / 7);
            if (recommendedBucSize === 0) {
              recommendedBucSize = 1;
            }
            setRecommenedBucketSize(recommendedBucSize);
            computeBuckets(recommendedBucSize, filteredArr);
            let bucketSizeArr = [];
            bucketSizeArr.push(recommendedBucSize);
            if (recommendedBucSize < 10) {
              for (let i = 1; i < 4; i++) {
                bucketSizeArr.push(recommendedBucSize + i);
                bucketSizeArr.push(recommendedBucSize - i);
              }
            } else if (recommendedBucSize >= 10 && recommendedBucSize < 25) {
              for (let i = 5; i < 20; i += 5) {
                bucketSizeArr.push(recommendedBucSize + i);
                bucketSizeArr.push(recommendedBucSize - i);
              }
            } else if (recommendedBucSize >= 25 && recommendedBucSize < 100) {
              for (let i = 10; i < 40; i += 10) {
                bucketSizeArr.push(recommendedBucSize + i);
                bucketSizeArr.push(recommendedBucSize - i);
              }
            } else if (recommendedBucSize >= 100 && recommendedBucSize < 250) {
              for (let i = 50; i < 200; i += 50) {
                bucketSizeArr.push(recommendedBucSize + i);
                bucketSizeArr.push(recommendedBucSize - i);
              }
            } else if (recommendedBucSize >= 250 && recommendedBucSize < 950) {
              for (let i = 200; i < 800; i += 200) {
                bucketSizeArr.push(recommendedBucSize + i);
                bucketSizeArr.push(recommendedBucSize - i);
              }
            } else if (recommendedBucSize >= 950 && recommendedBucSize < 2750) {
              for (let i = 700; i < 2100; i += 700) {
                bucketSizeArr.push(recommendedBucSize + i);
                bucketSizeArr.push(recommendedBucSize - i);
              }
            } else if (
              recommendedBucSize >= 2750 &&
              recommendedBucSize < 12000
            ) {
              for (let i = 2500; i < 10000; i += 2500) {
                bucketSizeArr.push(recommendedBucSize + i);
                bucketSizeArr.push(recommendedBucSize - i);
              }
            } else if (
              recommendedBucSize >= 12000 &&
              recommendedBucSize < 38000
            ) {
              for (let i = 8500; i < 34000; i += 8500) {
                bucketSizeArr.push(recommendedBucSize + i);
                bucketSizeArr.push(recommendedBucSize - i);
              }
            } else if (
              recommendedBucSize >= 38000 &&
              recommendedBucSize < 130000
            ) {
              for (let i = 30000; i < 120000; i += 30000) {
                bucketSizeArr.push(recommendedBucSize + i);
                bucketSizeArr.push(recommendedBucSize - i);
              }
            } else {
              for (let i = 60000; i < 240000; i += 60000) {
                bucketSizeArr.push(recommendedBucSize + i);
                bucketSizeArr.push(recommendedBucSize - i);
              }
            }
            bucketSizeArr.sort((a, b) => a - b);

            const arr = bucketSizeArr.filter(b => b > 0);
            setBucketSizes(arr);
          }
        }
      }
    }
  }, [selectedFeatures, selectedChart, rawData]);

  const handleClose = () => {
    setXAxisColumn("");
    setYAxisColumn("");
    onClose();
  };

  const handleXAxisChange = event => {
    setXAxisColumn(event.target.value);
  };

  const handleYAxisChange = event => {
    setYAxisColumn(event.target.value);
  };

  const onCreateButtonClick = () => {
    setChartSelectOpen(true);
    if (selectedChart === "Histogram") {
      setXAxisColumn(selectedFeatures[0]);
      setYAxisColumn("count");
      const x = { xAxisColumn: selectedFeatures[0] };
      const y = { yAxisColumn: "count" };
      dispatch(
        ACTIONS.updateGraphData({
          selectedChart: { selectedChart },
          xAxisColumn: x,
          yAxisColumn: y,
          numOfNull: numOfNull,
          newDataForHistogram: newDataForHistogram,
          bucketsArr: bucketsArr,
          bucketSize: bucketSize
        })
      );
    } else {
      dispatch(
        ACTIONS.updateGraphData({
          selectedChart: { selectedChart },
          xAxisColumn: { xAxisColumn },
          yAxisColumn: { yAxisColumn }
        })
      );
    }
  };
  const handleChartDialogClose = () => {
    setChartSelectOpen(false);
  };

  const computeBuckets = (buckSize, histogramData) => {
    setBucketSize(buckSize);

    if (histogramData.length > 0 && buckSize > 0) {
      //make buckets
      const minValue = min(histogramData);
      const maxValue = max(histogramData);

      const bucArr = [];

      for (let b = minValue; b <= maxValue; b += buckSize) {
        bucArr.push(b);
      }

      if (bucArr[bucArr.length - 1] !== maxValue) {
        bucArr.push(maxValue);
      }

      setBucketsArr(bucArr);
    }
  };

  const handleBucketSizeChange = event => {
    computeBuckets(event.target.value, newDataForHistogram);
  };

  return (
    <Dialog open={open} disableBackdropClick disableEscapeKeyDown>
      <DialogTitle>
        Set X Axis and Y Axis
        <IconButton aria-label="Close" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent align="center">
        {!showDropboxes && !showHistogram && selectedChart !== "Histogram" && (
          <DialogContentText>
            You need to select 1 or 2 columns.
          </DialogContentText>
        )}
        {!showHistogram && !showDropboxes && selectedChart === "Histogram" && (
          <DialogContentText>You need to select one column.</DialogContentText>
        )}
        {showHistogram && !showDropboxes && selectedChart === "Histogram" && (
          <div>
            <DialogContentText>X Axis: {selectedFeatures[0]}</DialogContentText>
            <DialogContentText>
              Recommended Size: {recommendedBucketSize}
            </DialogContentText>
            <InputLabel>Bucket size</InputLabel>
            <Select
              style={{ width: "100%" }}
              onChange={handleBucketSizeChange}
              value={bucketSize}
            >
              {bucketSizes.map(data => (
                <MenuItem value={data} key={data}>
                  {data}
                </MenuItem>
              ))}
            </Select>
          </div>
        )}
        {showDropboxes && !showHistogram && selectedChart !== "Histogram" && (
          <div style={{ width: "100%", marginBottom: "10%" }}>
            <div
              style={{ display: "inline-block", width: "45%", margin: "2%" }}
            >
              <InputLabel>X Axis</InputLabel>
              <Select
                style={{ width: "100%" }}
                onChange={handleXAxisChange}
                value={xAxisColumn}
                displayEmpty
              >
                <MenuItem disabled value="">
                  Select...
                </MenuItem>
                {props.selectedFeatures.map(data => (
                  <MenuItem value={data} key={data}>
                    {data}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div
              style={{ display: "inline-block", width: "45%", margin: "2%" }}
            >
              <InputLabel>Y Axis</InputLabel>
              <Select
                style={{ width: "100%" }}
                onChange={handleYAxisChange}
                value={yAxisColumn}
                displayEmpty
              >
                <MenuItem disabled value="">
                  Select...
                </MenuItem>
                {[
                  ...props.selectedFeatures,
                  ...(includeTargetColumn ? [targetColumnName] : [])
                ]
                  .filter(data => xAxisColumn !== data)
                  .map(data => {
                    return (
                      <MenuItem value={data} key={data}>
                        {data}
                      </MenuItem>
                    );
                  })}
              </Select>
            </div>
          </div>
        )}
      </DialogContent>
      {(showDropboxes || showHistogram) && (
        <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={onCreateButtonClick}
        >
          Create {selectedChart}
        </Button>
      )}
      <ChartDialog
        open={chartSelectOpen}
        onClose={handleChartDialogClose}
        selectedChart={selectedChart}
        selectedFeatures={selectedFeatures}
        xAxisColumn={xAxisColumn}
        yAxisColumn={yAxisColumn}
        rawData={rawData}
        bucketSize={bucketSize}
        numOfNull={numOfNull}
        newDataForHistogram={newDataForHistogram}
        bucketsArr={bucketsArr}
      ></ChartDialog>
    </Dialog>
  );
};

export default ChartColumnSelectDialog;

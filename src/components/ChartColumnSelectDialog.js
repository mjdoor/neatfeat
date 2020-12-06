import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    DialogContent,
    DialogContentText,
    Button
} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from "@material-ui/icons/Close";
import ChartDialog from "./ChartDialog";
import {useSelector, useDispatch } from "react-redux";
import ACTIONS from "../redux/actions";
import { min, max } from "../StatisticalFunctions/NumericStatsFormulas";
import { forEach } from "mathjs";

const ChartColumnSelectDialog = props => {
    const { onClose, selectedChart, open, selectedFeatures, rawData } = props;

    const dispatch = useDispatch();
    const { graphData } = useSelector(state => state);

    const [chartSelectOpen, setChartSelectOpen] = useState(false);
    const [xAxisColumn, setXAxisColumn] = useState("");
    const [yAxisColumn, setYAxisColumn] = useState("");
    const [showDropboxes, setShowDropboxes] = useState(false);
    const [showHistogram, setShowHistogram] = useState(false);
    const [recommendedBucketSize, setRecommenedBucketSize] = useState(0);
    const [bucketSize, setBucketSize] = useState(0);
    const [bucketSizes, setBucketSizes] = useState([]);
    const [numOfNull, setNumOfNull] = useState(0);
    const [newDataForHistogram, setNewDataForHistogram] = useState([]);
    const [bucketsArr, setBucketsArr] = useState([]);

    useEffect(() => {
        if((selectedFeatures.length > 2 || selectedFeatures.length === 0)) {
            setShowDropboxes(false);
            setShowHistogram(false);
        }
        else {
            if(selectedChart !== 'Histogram') {
                if(selectedChart !== '') {
                    setShowDropboxes(true);
                    setShowHistogram(false);
                    if(selectedFeatures.length === 1) {
                        selectedFeatures.push("Id");
                        setXAxisColumn("Id");
                    }
                }
            }
            else {
                if(selectedFeatures.length !== 1) {
                    setShowDropboxes(false);
                    setShowHistogram(false);
                }
                else {
                    setShowHistogram(true);
                    setShowDropboxes(false);

                    const convertData = {};
                    const columnData = [];
                    if(rawData !== undefined && selectedChart === 'Histogram') {     //for histogram
                        const featureNames = Object.keys(rawData[0]);
                        const initialColumnBuilder = featureNames.reduce((acc, featureName) => {
                        acc[featureName] = [];
                        return acc;
                        }, {}); // builds object { Feature1: [], Feature2: [],...}
                    const columns = rawData.reduce((acc, row) => {
                        Object.entries(row).forEach(([featureName, value]) => {
                            acc[featureName].push(value);
                        });
                        return acc;
                        }, initialColumnBuilder); // populates column arrays { Feature1: [1,2,3...], Feature2...}
                    const dataForHistogram = columns[selectedFeatures[0]];
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
                    const recommendedBucSize = Math.floor(difference / 7);
                    setRecommenedBucketSize(recommendedBucSize);
                    setBucketSize(recommendedBucketSize);
                    let bucketSizeArr = [];
                    bucketSizeArr.push(recommendedBucSize);
                    if(recommendedBucSize < 10) {
                        for(let i = 1; i < 4; i++) {
                            bucketSizeArr.push(recommendedBucSize + i);
                            bucketSizeArr.push(recommendedBucSize - i);
                        }
                    }
                    else if(recommendedBucSize >= 10 && recommendedBucSize < 25) {
                        for(let i = 5; i < 20; i += 5) {
                            bucketSizeArr.push(recommendedBucSize + i);
                            bucketSizeArr.push(recommendedBucSize - i);
                        }
                    }
                    else if(recommendedBucSize >= 25 && recommendedBucSize < 100) {
                        for(let i = 10; i < 40; i += 10) {
                            bucketSizeArr.push(recommendedBucSize + i);
                            bucketSizeArr.push(recommendedBucSize - i);
                        }
                    }
                    else if(recommendedBucSize >= 100 && recommendedBucSize < 250) {
                        for(let i = 50; i < 200; i+= 50) {
                            bucketSizeArr.push(recommendedBucSize + i);
                            bucketSizeArr.push(recommendedBucSize - i);
                        }
                    }
                    else if(recommendedBucSize >= 250 && recommendedBucSize < 950) {
                        for(let i = 200; i < 800; i+= 200) {
                            bucketSizeArr.push(recommendedBucSize + i);
                            bucketSizeArr.push(recommendedBucSize - i);
                        }
                    }
                    else if(recommendedBucSize >= 950 && recommendedBucSize < 2750) {
                        for(let i = 700; i < 2100; i+= 700) {
                            bucketSizeArr.push(recommendedBucSize + i);
                            bucketSizeArr.push(recommendedBucSize - i);
                        }
                    }
                    else if(recommendedBucSize >= 2750 && recommendedBucSize < 12000) {
                        for(let i = 2500; i < 10000; i+= 2500) {
                            bucketSizeArr.push(recommendedBucSize + i);
                            bucketSizeArr.push(recommendedBucSize - i);
                        }
                    }
                    else if(recommendedBucSize >= 12000 && recommendedBucSize < 38000) {
                        for(let i = 8500; i < 34000; i+= 8500) {
                            bucketSizeArr.push(recommendedBucSize + i);
                            bucketSizeArr.push(recommendedBucSize - i);
                        }
                    }
                    else if(recommendedBucSize >= 38000 && recommendedBucSize < 130000) {
                        for(let i = 30000; i < 120000; i+= 30000) {
                            bucketSizeArr.push(recommendedBucSize + i);
                            bucketSizeArr.push(recommendedBucSize - i);
                        }
                    }
                    else {
                        for(let i = 60000; i < 240000; i+= 60000) {
                            bucketSizeArr.push(recommendedBucSize + i);
                            bucketSizeArr.push(recommendedBucSize - i);
                        }
                    }
                    bucketSizeArr.sort((a, b) => a - b);
                    
                    const arr = bucketSizeArr.filter(b => b > 0);
                    setBucketSizes(arr);
                    const x = 1;
                    }
                } 
            }   
        }

    }, [selectedFeatures, selectedChart]);

    const handleClose = () => {
        onClose();
    }

    const handleXAxisChange = event => {
        setXAxisColumn(event.target.value);
    }

    const handleYAxisChange = (event) => {
        setYAxisColumn(event.target.value);
    }

    const onCreateButtonClick = () => {
        setChartSelectOpen(true);
        if(selectedChart === 'Histogram') {
            setXAxisColumn(selectedFeatures[0]);
            setYAxisColumn("count");
            const x = {"xAxisColumn" : selectedFeatures[0]};
            const y = {"yAxisColumn" : "count"};
            dispatch(ACTIONS.updateGraphData(
                {
                    selectedChart: {selectedChart},
                    xAxisColumn: x,
                    yAxisColumn: y,
                    numOfNull: numOfNull,
                    newDataForHistogram: newDataForHistogram,
                    bucketsArr: bucketsArr,
                    bucketSize: bucketSize
                }
            ));
        }
        else {
            dispatch(ACTIONS.updateGraphData(
                {
                    selectedChart: {selectedChart},
                    xAxisColumn: {xAxisColumn},
                    yAxisColumn: {yAxisColumn}
                }
            ));
        }
        
    }
    const handleChartDialogClose = () => {
        setChartSelectOpen(false);
    }

    const handleBucketSizeChange = (event) => {
        setBucketSize(event.target.value);

        if(newDataForHistogram !== undefined && event.target.value > 0) {
            //make buckets
            const minValue = min(newDataForHistogram);
            const maxValue = max(newDataForHistogram);

            const bucArr = [];

            for(let b = minValue; b <= maxValue; b += event.target.value) 
            { 
                bucArr.push(b);
            }

            if(bucketsArr[bucketsArr.length - 1] !== maxValue) {
                bucArr.push(maxValue);
            }

            setBucketsArr(bucArr);
        }
    }

    return (
        <Dialog
        open={open}
        disableBackdropClick
        disableEscapeKeyDown
        >
            <DialogTitle>
                Set X Axis and Y Axis
                <IconButton aria-label="Close"  onClick={handleClose}>
                 <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent align="center">
                {(!showDropboxes && !showHistogram && selectedChart !== 'Histogram') && (
                    <DialogContentText>You need to select 1 or 2 columns.</DialogContentText>
                )}
                {(!showHistogram && !showDropboxes && selectedChart === 'Histogram') && (
                     <DialogContentText>You need to select one column.</DialogContentText>
                )}
                {(showHistogram && !showDropboxes && selectedChart === 'Histogram') && (
                    <div>
                        <DialogContentText>X Axis: {selectedFeatures[0]}</DialogContentText>
                        <DialogContentText>Recommended Size: {recommendedBucketSize}</DialogContentText>
                        <InputLabel>Bucket size</InputLabel>
                        <Select style={{width: "100%"}} onChange={handleBucketSizeChange}
                        >
                        <MenuItem key="Placeholder" disabled>Bucket size</MenuItem>
                        {bucketSizes.map(data => (
                            <MenuItem value={data} key={data}>{data}</MenuItem>
                        ))}
                        </Select>
                    </div>
                )}
                {(showDropboxes && !showHistogram && selectedChart !== 'Histogram') && (
                    <div style={{ width: "100%", marginBottom: "10%" }}>
                        <div style={{ display: "inline-block", width: "45%", margin: "2%"}}>
                        <InputLabel>X Axis</InputLabel>
                        <Select style={{width: "100%"}} onChange={handleXAxisChange}
                        defaultValue={selectedFeatures.filter(feature => feature === "Id")}>
                        <MenuItem key="Placeholder" disabled>X Axis</MenuItem>
                        {props.selectedFeatures.map(data => (
                            <MenuItem value={data} key={data}>{data}</MenuItem>
                        ))}
                    </Select>
                    </div>
                    <div style={{ display: "inline-block", width: "45%", margin: "2%"}}>
                        <InputLabel>Y Axis</InputLabel>
                    <Select style={{width: "100%"}} onChange={handleYAxisChange}>
                        <MenuItem key="Placeholder" disabled>Y Axis</MenuItem>
                        {props.selectedFeatures.map(data => {
                            if(xAxisColumn !== data )
                            {
                                if(data !== "Id")
                                     return (<MenuItem value={data} key={data}>{data}</MenuItem>)
                            }
                            }
                            
                        )}
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
                >Create {selectedChart}</Button>
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
    )
}

export default ChartColumnSelectDialog;
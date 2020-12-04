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

const ChartColumnSelectDialog = props => {
    const { onClose, selectedChart, open, selectedFeatures, rawData } = props;

    const dispatch = useDispatch();
    const { graphData } = useSelector(state => state);

    const [chartSelectOpen, setChartSelectOpen] = useState(false);
    const [xAxisColumn, setXAxisColumn] = useState("");
    const [yAxisColumn, setYAxisColumn] = useState("");
    const [showDropboxes, setShowDropboxes] = useState(false);

    useEffect(() => {
        if(selectedFeatures.length > 2 || selectedFeatures.length === 0) {
            setShowDropboxes(false);
        }
        else {
            setShowDropboxes(true);
            if(selectedFeatures.length === 1) {
                selectedFeatures.push("Id");
                setXAxisColumn("Id");
            }
        }
    }, [selectedFeatures]);

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
        dispatch(ACTIONS.updateGraphData(
            {
                selectedChart: {selectedChart},
                xAxisColumn: {xAxisColumn},
                yAxisColumn: {yAxisColumn}
            }
        ));
    }
    const handleChartDialogClose = () => {
        setChartSelectOpen(false);
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
                {!showDropboxes && (
                    <DialogContentText>You need to select 1 or 2 columns.</DialogContentText>
                )}
                {showDropboxes && (
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
            {showDropboxes && (
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
              ></ChartDialog>
        </Dialog>
    )
}

export default ChartColumnSelectDialog;
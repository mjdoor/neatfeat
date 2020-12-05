import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  DialogContent,
  Button
} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { useDispatch, useSelector } from "react-redux";
import ChartDialog from "./ChartDialog";

const ExistingChartSelectDialog = props => {
    const { graphData } = useSelector(state => state);
    const [selectedValue, setSelectedValue] = useState();
    const [chartOpen, setChartOpen] = useState(false);
    const dispatch = useDispatch();

    const handleClose = () => {
        props.onClose(selectedValue);
      };

    const handleChange = event => {
        setSelectedValue(event.target.value);
        setChartOpen(true);
    }

    const handleChartDialogClose = () => {
        setChartOpen(false);
    }
    

    return (
        <Dialog 
        onClose={handleClose}
        open={props.open}
        disableBackdropClick
        disableEscapeKeyDown
        >
            <DialogTitle>Select a Chart on your history
            <IconButton aria-label="Close"  onClick={handleClose}>
                 <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent align="center">
                <FormControl style={{ minWidth: "8em", marginBottom: "2em", width: "85%" }}>
                    <InputLabel>Existing Charts</InputLabel>
                    <Select style={{ width: "100%" }} onChange={handleChange} >
                        {graphData.map(
                            (data, idx) => (
                                <MenuItem value={data} key={idx}>
                                    {data.selectedChart.selectedChart} - x:{data.xAxisColumn.xAxisColumn}, y: {data.yAxisColumn.yAxisColumn}
                                </MenuItem>
                            )
                        )}
                    </Select>
                </FormControl>
            </DialogContent>
            {selectedValue !== undefined && (
            <ChartDialog
            open={chartOpen}
            onClose={handleChartDialogClose}
            selectedChart={selectedValue.selectedChart.selectedChart}
            xAxisColumn={selectedValue.xAxisColumn.xAxisColumn}
            yAxisColumn={selectedValue.yAxisColumn.yAxisColumn}
            rawData={props.rawData}
            bucketSize={selectedValue.bucketSize}
            numOfNull={selectedValue.numOfNull}
            newDataForHistogram={selectedValue.newDataForHistogram}
            bucketsArr={selectedValue.bucketsArr} />
            )}
        </Dialog>
    )
}

export default ExistingChartSelectDialog;
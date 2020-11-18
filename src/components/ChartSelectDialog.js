import React, { useState } from "react";
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

const ChartSelectDialog = props => {
    const [selectedChart, setSelectedChart] = useState();
    const { onClose, selectedValue, open, selectedFeatures } = props;

    const handleClick = () => {
        onClose(selectedChart);
    }

    const handleChange = event => {
        setSelectedChart(event.target.value);
    }

    const handleClose = () => {
        onClose(selectedValue);
    }

    return (        
        <Dialog
        onClose={handleClose}
        open={open}
        disableBackdropClick
        disableEscapeKeyDown
        >
            <DialogTitle>Choose the Chart type</DialogTitle>
            <DialogContent align="center">
                {selectedFeatures.length !== 0 ? <div>
                        <DialogContentText>Selected Features</DialogContentText>
                        {selectedFeatures.map(feature => (
                            <DialogContentText key={feature}>{feature}</DialogContentText>
                        ))}
                        </div> : <DialogContentText>Select Features for a chart.</DialogContentText>}
                <FormControl style={{ minWidth: "8em", marginBottom: "2em" }}>
                    <InputLabel>Chart Type</InputLabel>
                    <Select onChange={handleChange}>
                        <MenuItem key="Placeholder" disabled>Chart Type</MenuItem>
                        {props.chartTypes.map(data => (
                            <MenuItem value={data} key={data}>
                                {data}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <Button onClick={handleClick} variant="contained" color="primary"> OK</Button>
        </Dialog>
    )
}

export default ChartSelectDialog;
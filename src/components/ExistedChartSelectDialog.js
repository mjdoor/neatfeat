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
import ACTIONS from "../redux/actions";

const ExistedChartSelectDialog = props => {
    const { graphData } = useSelector(state => state);
    const [selectedValue, setSelectedValue] = useState();
    const dispatch = useDispatch();

    const handleClose = () => {
        props.onClose(selectedValue);
      };

    const handleChange = event => {
        setSelectedValue(event.target.value);
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
                <FormControl style={{ minWidth: "8em", marginBottom: "2em" }}>
                    <InputLabel>Existing Charts</InputLabel>
                    <Select onChange={handleChange} >
                        {graphData.map(
                            (idx, data) => (
                                <MenuItem value={data} key={idx}>{data}
                                    {/* {data.selectedChart} - x:{data.xAxisColumn}, y: {data.yAxisColumn} */}
                                </MenuItem>
                            )
                        )}
                    </Select>
                </FormControl>
            </DialogContent>
        </Dialog>
    )
}

export default ExistedChartSelectDialog;
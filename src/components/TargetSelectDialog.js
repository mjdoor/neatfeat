import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  DialogContent,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import ACTIONS from "../redux/actions";

const TargetSelectDialog = (props) => {
  const { onClose, selectedValue, open } = props;
  const dispatch = useDispatch();
  const { rawData } = useSelector((state) => state);

  const handleChange = (event) => {
    dispatch(ACTIONS.changeTarget(event.target.value));

    // Store the data to the redux store
    dispatch(ACTIONS.createTable(props.data));

    onClose(event.target.value);
  };

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Choose the Target Column</DialogTitle>
      <DialogContent align="center">
        <FormControl style={{ minWidth: "8em", marginBottom: "2em" }}>
          <InputLabel>Target Column</InputLabel>
          <Select onChange={handleChange}>
            <MenuItem key="Placeholder" disabled>
              TargetColumn
            </MenuItem>
            {props.columns.map((data) => (
              <MenuItem value={data} key={data}>
                {data}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
};

export default TargetSelectDialog;

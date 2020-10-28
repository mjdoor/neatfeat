import React from "react";
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
import { useDispatch } from "react-redux";
import ACTIONS from "../redux/actions";

const TargetSelectDialog = props => {
  var target = props.columns[props.columns.length - 1];
  const { onClose, selectedValue, open } = props;
  const dispatch = useDispatch();

  const handleChange = event => {
    target = event.target.value;
  };

  const handleClick = () => {
    // Store the data to the redux store
    dispatch(ACTIONS.createTable(props.data, target));

    onClose(target);
  };

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle>Choose the Target Column</DialogTitle>
      <DialogContent align="center">
        <FormControl style={{ minWidth: "8em", marginBottom: "2em" }}>
          <InputLabel>Target Column</InputLabel>
          <Select defaultValue={target} onChange={handleChange}>
            <MenuItem key="Placeholder" disabled>
              TargetColumn
            </MenuItem>
            {props.columns.map(data => (
              <MenuItem value={data} key={data}>
                {data}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <Button onClick={handleClick} variant="contained" color="primary">
        Ok
      </Button>
    </Dialog>
  );
};

export default TargetSelectDialog;

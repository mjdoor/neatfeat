import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  InputLabel,
  DialogContent,
  Button,
  Checkbox,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import ACTIONS from "../redux/actions";

const TargetSelectDialog = (props) => {
  const {
    onClose,
    onError,
    selectedValue,
    open,
    data,
    columns,
    hasDataPassed,
  } = props;
  const { rawData, columnNames, targetColumnName } = useSelector(
    (state) => state
  );
  var hasData = hasDataPassed;
  const [addData, setAddData] = useState(false);
  const [target, setTarget] = useState(columns[columns.length - 1]);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setTarget(event.target.value);
  };

  const handleCheckChange = (event) => {
    if (event.target.checked) {
      setTarget(targetColumnName);
    } else {
      setTarget(columns[columns.length - 1]);
    }
    setAddData(event.target.checked);
  };

  const handleClick = () => {
    // Store the data to the redux store
    if (addData) {
      // compare columns
      if (isColumnsEqual(columnNames, columns)) {
        const newData = data.concat(rawData);
        // const newColumns = columnNames.concat(columns);      For future when adding new file with different columns than original dataset
        dispatch(ACTIONS.createTable(newData, target));
        dispatch(ACTIONS.updateColumnNames(columns));
      } else {
        onError("File doesn't match original dataset.");
      }
    } else {
      dispatch(ACTIONS.createTable(data, target));
      dispatch(ACTIONS.updateColumnNames(columns));
    }

    hasData = true;
    onClose(target, hasData, addData);
  };

  const isColumnsEqual = (arrOriginal, arrNew) => {
    var isEqual = false;
    arrOriginal.forEach((e) => (isEqual = arrNew.includes(e) > 0));

    return isEqual;
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
          {!addData && (
            <>
              <InputLabel>Target Column</InputLabel>
              <Select value={target} onChange={handleChange}>
                <MenuItem key="Placeholder" disabled>
                  TargetColumn
                </MenuItem>
                {columns.map((data) => (
                  <MenuItem value={data} key={data}>
                    {data}
                  </MenuItem>
                ))}
              </Select>
            </>
          )}
          {hasData && (
            <FormControlLabel
              control={
                <Checkbox
                  color="secondary"
                  checked={addData}
                  onChange={handleCheckChange}
                  name="chkAddData"
                />
              }
              label="Add data to current dataset"
            />
          )}
        </FormControl>
      </DialogContent>
      <Button onClick={handleClick} variant="contained" color="primary">
        Ok
      </Button>
    </Dialog>
  );
};

export default TargetSelectDialog;

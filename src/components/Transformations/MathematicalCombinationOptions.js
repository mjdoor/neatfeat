import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  Box
} from "@material-ui/core";

const MathematicalCombinationOptions = props => {
  const handleClose = () => {
    props.onClose();
  };

  const handleTransform = () => {
    const options = {};
    props.onTransform(options);
    props.onClose();
  };
  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        Mathematical Combination Options
      </DialogTitle>
      <DialogContent>
        <DialogContentText>---</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleTransform} color="primary">
          Transform
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MathematicalCombinationOptions;

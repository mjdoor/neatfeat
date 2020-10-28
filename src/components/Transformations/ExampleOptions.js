import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button,
  TextField
} from "@material-ui/core";

const ExampleOptions = props => {
  const [someOption, setSomeOption] = useState(0);

  const handleClose = () => {
    props.onClose();
  };

  const handleTransform = () => {
    const options = {
      /* whatever options you need for transformation */
      option1: someOption
    };
    props.onTransform(options);
    props.onClose();
  };
  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Example Options</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Whatever options needed for the transformation go here
        </DialogContentText>
        <TextField
          type="number"
          value={someOption}
          onChange={event => setSomeOption(Number(event.target.value))}
        />
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

export default ExampleOptions;

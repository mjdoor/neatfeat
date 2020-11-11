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

const CategoricalMissingDataOptions = props => {
  const imputeOptions = ["Most Frequent", "Constant"];

  const [radioOption, setRadioOption] = useState("impute");
  const [imputeMethod, setImputeMethod] = useState(imputeOptions[0]);
  const [imputeConstant, setImputeConstant] = useState("");

  const handleClose = () => {
    props.onClose();
  };

  const handleTransform = () => {
    const options = {
      handlingStrategy: radioOption,
      imputeMethod,
      imputeConstant
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
      <DialogTitle id="form-dialog-title">Missing Data Options</DialogTitle>
      <DialogContent>
        <DialogContentText>
          How would you like to handle the missing data for the selected
          features?
        </DialogContentText>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="missingdatahandler"
            name="missingdatahandler"
            value={radioOption}
            onChange={event => setRadioOption(event.target.value)}
          >
            <Box display="flex" flexDirection="row">
              <Box>
                <FormControlLabel
                  value="impute"
                  control={<Radio />}
                  label="Impute with"
                />
              </Box>
              <Box pt={0.5}>
                <Select
                  style={{ minWidth: 120, marginRight: 10 }}
                  value={imputeMethod}
                  onChange={event => setImputeMethod(event.target.value)}
                  disabled={radioOption !== "impute"}
                >
                  {imputeOptions.map((optionName, idx) => (
                    <MenuItem key={idx} value={optionName}>
                      {optionName}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              {imputeMethod === "Constant" && (
                <Box pt={0.5}>
                  <TextField
                    style={{ width: 120 }}
                    type="text"
                    value={imputeConstant}
                    onChange={event => {
                      setImputeConstant(event.target.value);
                    }}
                    placeholder="Replacement"
                    disabled={radioOption !== "impute"}
                  />
                </Box>
              )}
            </Box>
            <FormControlLabel
              value="delete"
              control={<Radio />}
              label="Delete Rows"
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleTransform}
          color="primary"
          disabled={
            radioOption === "impute" &&
            imputeMethod === "Constant" &&
            imputeConstant === ""
          }
        >
          Transform
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoricalMissingDataOptions;

import React, { useState, useEffect, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Typography
} from "@material-ui/core";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import { combinationWithReplacement } from "../../Utilities/NumberUtilities";

const StyledTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: "#ffffff",
    color: theme.palette.text.primary,
    maxWidth: 450,
    fontSize: theme.typography.pxToRem(12),
    boxShadow: "2px 2px 10px rgba(0.5,0.5,0.5,0.5)",
    padding: 10
  }
}))(Tooltip);

const PolynomialFeaturesOptions = props => {
  const featureDegreeOptions = [2, 3, 4];

  const [selectedDegree, setSelectedDegree] = useState("");
  const [examples, setExamples] = useState([]);

  useEffect(() => {
    if (selectedDegree !== "") {
      const buildExamplesForDegree = degree => {
        const retExs = [];
        retExs.push(`${props.selectedFeatures[0]}^${degree}`);
        if (props.selectedFeatures.length > 1) {
          if (props.selectedFeatures.length > 2 && degree > 2) {
            retExs.push(
              `${props.selectedFeatures[0]}^${degree - 1} * ${
                props.selectedFeatures[1]
              }`
            );
          }
          const maxNumberOfFeaturesToCombine = Math.min(
            degree,
            props.selectedFeatures.length
          );
          retExs.push(
            `${props.selectedFeatures
              .slice(0, maxNumberOfFeaturesToCombine)
              .join(" * ")}${
              maxNumberOfFeaturesToCombine < degree
                ? `^${degree - maxNumberOfFeaturesToCombine + 1}`
                : ""
            }`
          );
        }
        return retExs;
      };

      let tempExamples = [];
      for (let i = 2; i <= selectedDegree; i++) {
        tempExamples = [...tempExamples, ...buildExamplesForDegree(i)];
      }

      setExamples(tempExamples);
    }
  }, [props.selectedFeatures, selectedDegree]);

  const handleClose = () => {
    props.onClose();
  };

  const handleTransform = () => {
    const options = {
      degree: selectedDegree,
      availableDegrees: featureDegreeOptions
    };
    props.onTransform(options);
    props.onClose();
  };

  // Impose limit so too many features can't be added in an attempt to prevent out of memory errors.
  // combinationWithReplacement calculates the number of new features that would be added specifically for the selected degree
  const hasTooManyNewFeatures =
    selectedDegree !== "" &&
    combinationWithReplacement(props.selectedFeatures.length, selectedDegree) >
      5000;
  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        Polynomial Features Options
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select the desired degree of polynomial features to create.
        </DialogContentText>
        <FormControl
          component="fieldset"
          error={hasTooManyNewFeatures}
          style={{ maxWidth: 300 }}
        >
          <InputLabel id="polynomial-features-select-label">Degree</InputLabel>
          <Select
            labelid="polynomial-features-select-label"
            style={{ minWidth: 120, marginRight: 10 }}
            value={selectedDegree}
            onChange={event => setSelectedDegree(event.target.value)}
          >
            {featureDegreeOptions.map(degree => (
              <MenuItem key={degree} value={degree}>
                {degree}
              </MenuItem>
            ))}
          </Select>
          {hasTooManyNewFeatures && (
            <FormHelperText>
              Unable to create so many new polynomial features. Please select a
              lower degree or fewer features.
            </FormHelperText>
          )}
        </FormControl>
        {selectedDegree !== "" && (
          <StyledTooltip
            arrow
            style={{ marginTop: 20 }}
            title={
              <Fragment>
                <Typography>
                  New features will be added that represent all possible
                  combinations of products of{" "}
                  {(() => {
                    switch (selectedDegree) {
                      case 2:
                        return "2";
                      case 3:
                        return "2 and 3";
                      case 4:
                        return "2, 3, and 4";
                    }
                  })()}{" "}
                  selected features at a time, including combinations where a
                  feature is multiplied by itself.
                </Typography>
                <Typography style={{ margin: "10px 0" }}>
                  A sample of the features that will be created are shown below.
                </Typography>
                {examples.map((example, idx) => (
                  <Typography key={idx} fontSize={10}>
                    {example}
                  </Typography>
                ))}
              </Fragment>
            }
          >
            <HelpOutlineOutlinedIcon color="primary" />
          </StyledTooltip>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleTransform}
          color="primary"
          disabled={selectedDegree === "" || hasTooManyNewFeatures}
        >
          Transform
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PolynomialFeaturesOptions;

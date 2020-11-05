import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Autocomplete } from "@material-ui/lab";

import { evaluate } from "mathjs";

import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box
} from "@material-ui/core";

const availableFunctions = [
  "abs",
  "sin",
  "cos",
  "tan",
  "pow",
  "sqrt",
  "log",
  "exp",
  "max",
  "min"
];

const MathematicalCombinationOptions = props => {
  const [newFeatureName, setNewFeatureName] = useState("");
  const [formulaTerms, setFormulaTerms] = useState([]);
  const [featureNameError, setFeatureNameError] = useState(null);
  const [formulaError, setFormulaError] = useState(null);
  const [formulaExample, setFormulaExample] = useState("");
  const existingColumnNames = useSelector(state => state.columnNames);

  // useEffect used just to provide different random formula examples
  useEffect(() => {
    const numSelectedFeatures = props.selectedFeatures.length;
    const randomFeatureIndex = Math.floor(Math.random() * numSelectedFeatures);
    const feature1 = props.selectedFeatures[randomFeatureIndex];
    let examples = [
      `${feature1} + 5`,
      `sin(${feature1} / 100)`,
      `25 * log(${feature1})`,
      `abs(${feature1})`
    ];
    if (numSelectedFeatures > 1) {
      const randomFeatureIndex2 =
        (randomFeatureIndex + 1) % numSelectedFeatures;
      const feature2 = props.selectedFeatures[randomFeatureIndex2];
      examples = [
        ...examples,
        `${feature1} / ${feature2}`,
        `exp(${feature2}) + ${feature1}`,
        `pow(${feature1},3) + 1.7 * ${feature2}`
      ];
    }
    const randomExampleIndex = Math.floor(Math.random() * examples.length);
    setFormulaExample(`e.g. ${examples[randomExampleIndex]}`);
    // eslint-disable-next-line
  }, [formulaTerms]);

  const formulaOptions = [
    ...props.selectedFeatures.map(featureName => ({
      type: "Feature",
      name: featureName
    })),
    ...availableFunctions.map(funcName => ({
      type: "Function",
      name: funcName
    }))
  ];

  const handleClose = () => {
    props.onClose();
  };

  const handleTransform = () => {
    const options = {
      expressionString: formulaTerms
        .map(term => {
          if (typeof term === "object") {
            // wrap the feature name in pipes to help identify features, in case features have same name as functions
            return term.type === "Feature" ? `|${term.name}|` : term.name;
          } else return term.trim();
        })
        .join(""),
      newFeatureName
    };
    props.onTransform(options);
    props.onClose();
  };

  const handleFormulaChange = allTerms => {
    const currentFormulaTerms = allTerms.map(term => {
      if (typeof term === "string") {
        return term.trim();
      } else return term;
    });

    if (allTerms.length > formulaTerms.length) {
      // Automatically adds a starting bracket when a function name is added,
      // as long as we didn't just get rid of a term (which would be the left bracket) via a backspace (hence the check for allTerms.length > forumlaTerms.length)
      const lastTerm = currentFormulaTerms[currentFormulaTerms.length - 1];
      if (typeof lastTerm === "object" && lastTerm.type === "Function") {
        currentFormulaTerms.push("(");
      }
    }

    setFormulaTerms(currentFormulaTerms);
  };

  const checkFeatureName = () => {
    if (newFeatureName === "") {
      setFeatureNameError("Feature name can't be blank");
    } else if (existingColumnNames.includes(newFeatureName)) {
      setFeatureNameError(
        `The feature name ${newFeatureName} is already in use`
      );
    } else setFeatureNameError(null);
  };

  const checkFormula = () => {
    try {
      evaluate(
        formulaTerms
          .map(term => {
            if (typeof term === "object") {
              return term.type === "Feature" ? Math.random() : term.name; // put random numbers in place of the features just to check if the syntax works out
            } else return term.trim();
          })
          .join("")
      );
      setFormulaError(null);
    } catch (err) {
      setFormulaError(err.message.split("(")[0]); // take the error message up to the first bracket (which usually just contains the character number)
    }
  };

  const shouldDisable =
    newFeatureName === "" ||
    formulaTerms.length === 0 ||
    featureNameError !== null ||
    formulaError !== null;

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
        <DialogContentText>
          Write out the formula you want to use to combine the selected columns.
          Hit enter before and after adding functions or features to the formula
          to see what's available.
        </DialogContentText>
        <Box width="100%" display="flex" justifyContent="center">
          <TextField
            value={newFeatureName}
            onChange={event => setNewFeatureName(event.target.value)}
            label="New Feature Name"
            onBlur={checkFeatureName}
            error={featureNameError !== null}
            helperText={featureNameError}
          />
        </Box>
        <Grid container direction="row" spacing={0} alignItems="center">
          <Grid item>
            <p style={{ paddingRight: 10 }}>=</p>
          </Grid>
          <Grid item xs={11}>
            <Autocomplete
              multiple
              autoSelect
              autoHighlight
              id="equation-box"
              options={formulaOptions}
              groupBy={option => option.type}
              freeSolo
              getOptionLabel={option => option.name}
              onChange={(event, allTerms) => {
                handleFormulaChange(allTerms);
              }}
              value={formulaTerms}
              renderTags={terms => {
                return terms.map((option, index) => {
                  if (typeof option === "object") {
                    return (
                      <p
                        style={{
                          color: option.type === "Function" ? "#cc00ff" : "blue"
                        }}
                        key={index}
                      >
                        {option.name}
                      </p>
                    );
                  } else return <p key={index}>{option}</p>;
                });
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder={
                    formulaTerms.length === 0 ? formulaExample : null
                  }
                  onBlur={checkFormula}
                  error={formulaError !== null}
                  helperText={formulaError}
                />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleTransform}
          color="primary"
          disabled={shouldDisable}
        >
          Transform
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MathematicalCombinationOptions;

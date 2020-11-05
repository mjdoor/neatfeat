import React, { Fragment, useState } from "react";
import {
  Switch,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { useSelector, useDispatch } from "react-redux";
import ACTIONS from "../../redux/actions";

import NumericalMissingDataOptions from "../Transformations/NumericalMissingDataOptions";
import NumericalMissingDataTransformer from "../../Transformers/NumericalMissingDataTransformer";
import CategoricalMissingDataOptions from "../Transformations/CategoricalMissingDataOptions";
import CategoricalMissingDataTransformer from "../../Transformers/CategoricalMissingDataTransformer";
import ScalingTransformer from "../../Transformers/ScalingTransformer";
import NormalizationTransformer from "../../Transformers/NormalizationTransformer";
import OneHotEncodingTransformation from "../../Transformers/OneHotEncodingTransformation";
import MathematicalCombinationOptions from "../Transformations/MathematicalCombinationOptions";
import MathematicalCombinationTransformer from "../../Transformers/MathematicalCombinationTransformer";

import StatisticsTable from "./StatisticsTable";

const allTransformers = {
  categorical: [
    {
      name: "One Hot Encoding",
      transformFunction: OneHotEncodingTransformation
    },
    {
      name: "Handle Missing Data",
      transformFunction: CategoricalMissingDataTransformer,
      optionComponent: CategoricalMissingDataOptions
    }
  ],
  numerical: [
    {
      name: "Handle Missing Data",
      transformFunction: NumericalMissingDataTransformer,
      optionComponent: NumericalMissingDataOptions
    },
    {
      name: "Scale",
      transformFunction: ScalingTransformer
    },
    {
      name: "Normalize",
      transformFunction: NormalizationTransformer
    }
  ]
};

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150
  }
}));

const StatsData = props => {
  const [showNumeric, setShowNumeric] = useState(true);
  const [selectedFeatures, setSelectedFeatures] = useState([]); // selectedFeatures can be used by the transformations so they know what columns to operate on
  const [optionComponentTransformer, setOptionComponentTransformer] = useState(
    null
  );
  const { rawData, statsData } = useSelector(state => state);
  const dispatch = useDispatch();

  const classes = useStyles();

  const handleTransformationSelect = transformerName => {
    const selectedTransformer = availableTransformers.find(
      t => t.name === transformerName
    );

    if (selectedTransformer.hasOwnProperty("optionComponent")) {
      setOptionComponentTransformer(selectedTransformer);
    } else {
      updateData(
        selectedTransformer.transformFunction(
          rawData,
          selectedFeatures,
          statsData // added statsData in case it can be useful for the transformation.
        )
      );
    }
  };

  const handleTransformWithOptions = options => {
    updateData(
      optionComponentTransformer.transformFunction(
        rawData,
        selectedFeatures,
        options,
        statsData // added statsData in case it can be useful for the transformation.
      )
    );
  };

  const updateData = transformedData => {
    dispatch(ACTIONS.updateTable(transformedData));
  };

  const handleSelectionChange = selectedFeatureNames => {
    setSelectedFeatures(selectedFeatureNames);
  };

  const allTransformers = {
    categorical: [
      {
        name: "Handle Missing Data",
        transformFunction: CategoricalMissingDataTransformer,
        optionComponent: CategoricalMissingDataOptions
      }
    ],
    numerical: [
      {
        name: "Handle Missing Data",
        transformFunction: NumericalMissingDataTransformer,
        optionComponent: NumericalMissingDataOptions
      },
      {
        name: "Mathematically Combine",
        transformFunction: MathematicalCombinationTransformer,
        optionComponent: props => (
          <MathematicalCombinationOptions
            selectedFeatures={selectedFeatures}
            {...props}
          />
        )
      }
    ]
  };

  const availableTransformers = showNumeric
    ? allTransformers.numerical
    : allTransformers.categorical;

  const OptionComponent = optionComponentTransformer?.optionComponent;

  return (
    <div style={{ padding: 10 }}>
      {statsData !== undefined && (
        <Fragment>
          <Grid component="div" container alignItems="center">
            <Grid item>
              <Typography
                component="p"
                style={{ fontWeight: showNumeric ? "normal" : "bold" }}
              >
                Categorical
              </Typography>
            </Grid>
            <Grid item>
              <Switch
                checked={showNumeric}
                onChange={() => setShowNumeric(orig => !orig)}
                name="datatypeSwitch"
              />
            </Grid>
            <Grid item>
              <Typography
                component="p"
                style={{ fontWeight: showNumeric ? "bold" : "normal" }}
              >
                Numerical
              </Typography>
            </Grid>
            <Grid item style={{ marginLeft: "auto" }}>
              <FormControl
                className={classes.formControl}
                disabled={selectedFeatures.length === 0}
              >
                <InputLabel>Transformations</InputLabel>
                <Select
                  value={""}
                  onChange={event =>
                    handleTransformationSelect(event.target.value)
                  }
                >
                  {availableTransformers.map((transformer, idx) => (
                    <MenuItem key={idx} value={transformer.name}>
                      {transformer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <StatisticsTable
            numerical={showNumeric}
            statsData={statsData}
            onSelectionChange={handleSelectionChange}
          />
          {optionComponentTransformer && (
            <OptionComponent
              onClose={() => setOptionComponentTransformer(null)}
              onTransform={handleTransformWithOptions}
            />
          )}
        </Fragment>
      )}
    </div>
  );
};

export default StatsData;

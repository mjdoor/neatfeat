import React, { Fragment, useState } from "react";
import {
  Switch,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button
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
import DeleteColumns from "../../Transformers/DeleteColumns";
import StatisticsTable from "./StatisticsTable";
import ChartSelectDialog from "../ChartSelectDialog";


const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150
  }
}));
//TODO: get selected rows to delete from transformer

const StatsData = props => {
  const [showNumeric, setShowNumeric] = useState(true);
  const [selectedFeatures, setSelectedFeatures] = useState([]); // selectedFeatures can be used by the transformations so they know what columns to operate on
  const [optionComponentTransformer, setOptionComponentTransformer] = useState(
    null
  );
  const [chartSelectOpen, setChartSelectOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const { rawData, statsData } = useSelector(state => state);
  const dispatch = useDispatch();

  const classes = useStyles();
  
  const chartTypes = ["BarChart", "ScatterChart"];

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
          statsData
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
        statsData
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
      },
      {
        name: "One Hot Encoding",
        transformFunction: OneHotEncodingTransformation
      },
    {
      name: "Delete Columns",
      transformFunction: DeleteColumns
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
      },
    {
      name: "Delete Columns",
      transformFunction: DeleteColumns
    }
    ]
  };

  const availableTransformers = showNumeric
    ? allTransformers.numerical
    : allTransformers.categorical;

  const OptionComponent = optionComponentTransformer?.optionComponent;

  const handleCreateChartButton = () => {
    setChartSelectOpen(true);
  }

  const handleChartDialogClose = value => {
    setChartSelectOpen(false);
    setSelectedValue(value);
  }

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
              <Button
              variant="contained"
              color="secondary"
              size="medium"
              onClick={handleCreateChartButton}>Create Chart</Button>
              <ChartSelectDialog
              open={chartSelectOpen}
              onClose={handleChartDialogClose}
              chartTypes={chartTypes}
              selectedValue={selectedValue}
              selectedFeatures={selectedFeatures}
              >
              
              </ChartSelectDialog>
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

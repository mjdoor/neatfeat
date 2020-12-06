import React, { Fragment, useState } from "react";
import {
  Switch,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { useSelector, useDispatch } from "react-redux";
import ACTIONS from "../../redux/actions";

import { deepCopy } from "../../Utilities/ObjectUtilities";

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
import PolynomialFeaturesOptions from "../Transformations/PolynomialFeaturesOptions";
import PolynomialFeaturesTransformer from "../../Transformers/PolynomialFeaturesTransformer";

import StatisticsTable from "./StatisticsTable";
import ChartColumnSelectDialog from "../ChartColumnSelectDialog";
import ExistingChartSelectDialog from "../ExistingChartSelectDialog";
import ReactTooltip from "react-tooltip";
import InfoIcon from "@material-ui/icons/Info";

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
  const [chartSelectOpen, setChartSelectOpen] = useState(false);
  const [showSelectChartOpen, setSelectShowChartOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState("");
  const {
    rawData,
    statsData,
    isTransforming,
    targetColumnName,
    graphData
  } = useSelector(state => state.present);
  const dispatch = useDispatch();

  const classes = useStyles();

  const chartTypes = ["ScatterChart", "Histogram"];

  const handleTransformationSelect = transformerName => {
    const selectedTransformer = availableTransformers.find(
      t => t.name === transformerName
    );

    if (selectedTransformer.hasOwnProperty("optionComponent")) {
      setOptionComponentTransformer(selectedTransformer);
    } else {
      updateData(
        selectedTransformer.transformFunction(
          deepCopy(rawData), // need to copy the data in case to ensure the present state for each row isn't changed directly, which will mess up undo/redo functionality
          selectedFeatures,
          statsData
        )
      );
    }
  };

  const handleChartSelect = chartType => {
    setSelectedChart(chartType);
    setChartSelectOpen(true);
  };

  const showChartOpen = () => {
    setSelectShowChartOpen(true);
  };

  // added async/await here for PolynomialFeaturesTransformer, since its performance was much better when async.
  /// But this code still works for non-async transformers as well.
  const handleTransformWithOptions = async options => {
    dispatch(ACTIONS.applyTransformation(true));
    updateData(
      await optionComponentTransformer.transformFunction(
        deepCopy(rawData), // need to copy the data in case to ensure the present state for each row isn't changed directly, which will mess up undo/redo functionality
        selectedFeatures,
        options,
        statsData
      )
    );
    dispatch(ACTIONS.applyTransformation(false));
  };

  const updateData = transformedData => {
    dispatch(ACTIONS.updateTable(transformedData));
  };

  const handleSelectionChange = selectedFeatureNames => {
    setSelectedFeatures(selectedFeatureNames);
    setSelectedChart("");
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
        name: `Delete Column${selectedFeatures.length === 1 ? "" : "s"}`,
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
        name: "Add Polynomial Features",
        transformFunction: PolynomialFeaturesTransformer,
        optionComponent: props => (
          <PolynomialFeaturesOptions
            selectedFeatures={selectedFeatures}
            {...props}
          />
        )
      },
      {
        name: `Delete Column${selectedFeatures.length === 1 ? "" : "s"}`,
        transformFunction: DeleteColumns
      }
    ]
  };

  const availableTransformers = showNumeric
    ? allTransformers.numerical
    : allTransformers.categorical;

  const OptionComponent = optionComponentTransformer?.optionComponent;

  const handleChartDialogClose = () => {
    setChartSelectOpen(false);
  };

  const handleShowChartDialogClose = () => {
    setSelectShowChartOpen(false);
  };

  return (
    <div style={{ padding: 10 }}>
      {statsData !== undefined && (
        <Grid container>
          <Grid item xs={"auto"} style={{ position: "relative", minWidth: 40 }}>
            <Typography
              component="div"
              style={{
                position: "absolute",
                width: 200,
                top: "40%",
                left: "50%",
                transform: "translateX(-50%) translateY(-50%) rotate(-90deg)",
                fontWeight: "bold",
                fontSize: 30
              }}
            >
              Stats Data
            </Typography>
          </Grid>
          <Grid item xs>
            <Grid container alignItems="flex-end">
              <Grid item>
                <Grid container alignItems="center">
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
                </Grid>
              </Grid>
              {isTransforming && (
                <Fragment>
                  <Grid item style={{ marginLeft: 100 }}>
                    <CircularProgress />
                  </Grid>
                  <Grid item>
                    <Typography>Applying transformation...</Typography>
                  </Grid>
                </Fragment>
              )}
              <Grid item style={{ marginLeft: "auto", marginTop: "18px" }}>
                {graphData.length > 0 && (
                  <Button onClick={showChartOpen} hidden={false} size="small">
                    Show Previous Chart{graphData.length === 1 ? "" : "s"}
                  </Button>
                )}
              </Grid>
              <Grid item>
                <div style={{ marginTop: "18px" }}>
                  <InfoIcon data-tip data-for="chartTooltip" />
                  <ReactTooltip id="chartTooltip" place="top" effect="solid">
                    Select two columns for scatter chart, one column for
                    histogram. If one column is selected for scatter chart, the
                    target column ({targetColumnName}) will be used as the
                    Y-axis automatically.
                  </ReactTooltip>
                </div>
              </Grid>
              <Grid item>
                <FormControl
                  className={classes.formControl}
                  disabled={selectedFeatures.length === 0}
                >
                  <InputLabel>Create chart</InputLabel>
                  <Select
                    value={selectedChart}
                    onChange={event => handleChartSelect(event.target.value)}
                    disabled={!showNumeric}
                  >
                    {chartTypes.map((chartType, idx) => (
                      <MenuItem key={idx} value={chartType}>
                        {chartType}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <ChartColumnSelectDialog
                  open={chartSelectOpen}
                  onClose={handleChartDialogClose}
                  chartTypes={chartTypes}
                  selectedChart={selectedChart}
                  selectedFeatures={selectedFeatures}
                  rawData={rawData}
                ></ChartColumnSelectDialog>
                <ExistingChartSelectDialog
                  open={showSelectChartOpen}
                  onClose={handleShowChartDialogClose}
                  rawData={rawData}
                />
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
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default StatsData;

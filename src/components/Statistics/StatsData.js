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
  CircularProgress,
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
import PolynomialFeaturesOptions from "../Transformations/PolynomialFeaturesOptions";
import PolynomialFeaturesTransformer from "../../Transformers/PolynomialFeaturesTransformer";

import StatisticsTable from "./StatisticsTable";
import ChartColumnSelectDialog from "../ChartColumnSelectDialog";
import ExistingChartSelectDialog from "../ExistingChartSelectDialog";
import ReactTooltip from "react-tooltip";
import InfoIcon from "@material-ui/icons/Info";


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
}));

const StatsData = (props) => {
  const [showNumeric, setShowNumeric] = useState(true);
  const [selectedFeatures, setSelectedFeatures] = useState([]); // selectedFeatures can be used by the transformations so they know what columns to operate on
  const [optionComponentTransformer, setOptionComponentTransformer] = useState(
    null
  );
  const [chartSelectOpen, setChartSelectOpen] = useState(false);
  const [showSelectChartOpen, setSelectShowChartOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState("");
  const [isChartCreated, setIsChartCreated] = useState(false);
  const { rawData, statsData, isTransforming } = useSelector((state) => state);
  const dispatch = useDispatch();

  const classes = useStyles();
  
  const chartTypes = ["BarChart", "ScatterChart", "Histogram"];

  const handleTransformationSelect = (transformerName) => {
    const selectedTransformer = availableTransformers.find(
      (t) => t.name === transformerName
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

  const handleChartSelect = chartType => {
    setSelectedChart(chartType);
    setChartSelectOpen(true);
    setIsChartCreated(true);
  }

  const showChartOpen = () => {
    setSelectShowChartOpen(true);
  }

  // added async/await here for PolynomialFeaturesTransformer, since its performance was much better when async.
  /// But this code still works for non-async transformers as well.
  const handleTransformWithOptions = async (options) => {
    dispatch(ACTIONS.applyTransformation(true));
    updateData(
      await optionComponentTransformer.transformFunction(
        rawData,
        selectedFeatures,
        options,
        statsData
      )
    );
    dispatch(ACTIONS.applyTransformation(false));
  };

  const updateData = (transformedData) => {
    dispatch(ACTIONS.updateTable(transformedData));
  };

  const handleSelectionChange = (selectedFeatureNames) => {
    setSelectedFeatures(selectedFeatureNames);
  };

  const allTransformers = {
    categorical: [
      {
        name: "Handle Missing Data",
        transformFunction: CategoricalMissingDataTransformer,
        optionComponent: CategoricalMissingDataOptions,
      },
      {
        name: "One Hot Encoding",
        transformFunction: OneHotEncodingTransformation,
      },
      {
        name: "Delete Columns",
        transformFunction: DeleteColumns,
      },
      {
        name: "Delete Columns",
        transformFunction: DeleteColumns,
      },
    ],
    numerical: [
      {
        name: "Handle Missing Data",
        transformFunction: NumericalMissingDataTransformer,
        optionComponent: NumericalMissingDataOptions,
      },
      {
        name: "Scale",
        transformFunction: ScalingTransformer,
      },
      {
        name: "Normalize",
        transformFunction: NormalizationTransformer,
      },
      {
        name: "Mathematically Combine",
        transformFunction: MathematicalCombinationTransformer,
        optionComponent: (props) => (
          <MathematicalCombinationOptions
            selectedFeatures={selectedFeatures}
            {...props}
          />
        ),
      },
      {
        name: "Add Polynomial Features",
        transformFunction: PolynomialFeaturesTransformer,
        optionComponent: (props) => (
          <PolynomialFeaturesOptions
            selectedFeatures={selectedFeatures}
            {...props}
          />
        ),
      },
      {
        name: "Delete Columns",
        transformFunction: DeleteColumns,
      },
    ],
  };

  const availableTransformers = showNumeric
    ? allTransformers.numerical
    : allTransformers.categorical;

  const OptionComponent = optionComponentTransformer?.optionComponent;

  const handleChartDialogClose = () => {
    setChartSelectOpen(false);
  }

  const handleShowChartDialogClose = () => {
    setSelectShowChartOpen(false);
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
                onChange={() => setShowNumeric((orig) => !orig)}
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
            <Grid item style={{ marginLeft: "auto", marginTop: "18px" }}>
              {isChartCreated && (
              <Button onClick={showChartOpen} hidden={false} size="small">Show Previous Chart</Button>
              )}
            </Grid>
            <Grid item>
              <div style={{marginTop: "18px"}}>
              <InfoIcon data-tip data-for="chartTooltip" />
              <ReactTooltip id="chartTooltip" place="top" effect="solid">Select two columns for charts. If you select only one column, X Axis will be set to Id automatically. For Histogram, select one column.</ReactTooltip>
              </div>
            </Grid>
            <Grid item>
            <FormControl
                className={classes.formControl}
                disabled={selectedFeatures.length === 0}
              >
                <InputLabel>Create chart</InputLabel>
                <Select
                  value={""}
                  onChange={event =>
                    handleChartSelect(event.target.value)
                  }
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
              <ExistingChartSelectDialog open={showSelectChartOpen} onClose={handleShowChartDialogClose} rawData={rawData} />

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
            <Grid item style={{ marginLeft: "auto" }}>
              <FormControl
                className={classes.formControl}
                disabled={selectedFeatures.length === 0}
              >
                <InputLabel>Transformations</InputLabel>
                <Select
                  value={""}
                  onChange={(event) =>
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

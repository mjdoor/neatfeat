import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { Switch, Grid, Typography } from "@material-ui/core";

import StatisticsTable from "./StatisticsTable";

const StatsData = props => {
  const [showNumeric, setShowNumeric] = useState(true);
  const [selectedFeatures, setSelectedFeatures] = useState([]); // selectedFeatures can be used by the transformations so they know what columns to operate on
  const { statsData } = useSelector(state => state);

  const handleSelectionChange = selectedFeatureNames => {
    setSelectedFeatures(selectedFeatureNames);
  };

  return (
    <div>
      {statsData !== undefined && (
        <Fragment>
          <Grid component="label" container alignItems="center" spacing={1}>
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
            <Typography
              component="p"
              style={{ fontWeight: showNumeric ? "bold" : "normal" }}
            >
              Numerical
            </Typography>
          </Grid>
          <StatisticsTable
            numerical={showNumeric}
            statsData={statsData}
            onSelectionChange={handleSelectionChange}
          />
        </Fragment>
      )}
    </div>
  );
};

export default StatsData;

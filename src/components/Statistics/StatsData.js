import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Switch, Grid, Typography } from "@material-ui/core";
import ACTIONS from "../../redux/actions";

import StatisticsTable from "./StatisticsTable";

const StatsData = props => {
  const dispatch = useDispatch();
  const [showNumeric, setShowNumeric] = useState(true);
  const { statsData } = useSelector(state => state);

  return (
    <div>
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
      <Button
        variant="contained"
        color="primary"
        onClick={() => dispatch(ACTIONS.createTestTable())}
      >
        Test Data
      </Button>
      <br />
      {statsData !== undefined && (
        <StatisticsTable numerical={showNumeric} statsData={statsData} />
      )}
    </div>
  );
};

export default StatsData;

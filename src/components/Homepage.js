//npm install react-data-grid@7.0.0-canary.15

import React from "react";
import { Typography, Paper } from "@material-ui/core";
<<<<<<< HEAD
import DataGridTable from "./DataGridTable";
=======
import StatsData from "./Statistics/StatsData";
>>>>>>> 3fadf65159de37844137e8b4f2eb9b6b93473abb

const Homepage = () => {
  return (
    <div style={{ padding: 10 }}>
      <Paper
        elevation={3}
        style={{
          width: "min-content",
          margin: "0 auto",
          padding: 20,
          marginTop: 30
        }}
        align="center"
      >
        <Typography variant="h3" color="primary" align="center" noWrap>
          Neat Feat
        </Typography>
      </Paper>
<<<<<<< HEAD
      <DataGridTable />
=======
      <StatsData />
>>>>>>> 3fadf65159de37844137e8b4f2eb9b6b93473abb
    </div>
  );
};

export default Homepage;

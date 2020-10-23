import React from "react";
import { Typography } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import UploadCSV from "./UploadCSV";
import DataGridTable from "./DataGridTable";

const AppToolBar = () => {
  return (
    <div style={{ padding: 10 }}>
      <AppBar>
        <Toolbar>
          <Typography color="secondary" align="left" noWrap variant="h4">
            Neat Feat
          </Typography>
        </Toolbar>
      </AppBar>
      <UploadCSV />
    </div>
  );
};

export default AppToolBar;

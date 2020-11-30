import React from "react";
import { Typography } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import UploadCSV from "./UploadCSV";

import { useDispatch } from "react-redux";
import { ActionCreators } from "redux-undo";

const AppToolBar = () => {
  const dispatch = useDispatch();
  return (
    <div style={{ padding: 10 }}>
      <AppBar>
        <Toolbar>
          <Typography color="secondary" align="left" noWrap variant="h4">
            Neat Feat
          </Typography>
        </Toolbar>
        <button onClick={() => dispatch(ActionCreators.undo())}>Undo</button>
        <button onClick={() => dispatch(ActionCreators.redo())}>Redo</button>
      </AppBar>
      <UploadCSV />
    </div>
  );
};

export default AppToolBar;

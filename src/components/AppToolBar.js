import React, { useEffect } from "react";
import { Typography, IconButton, Grid, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import UploadCSV from "./UploadCSV";
import DownloadCSV from "./DownloadCSV";

import { useDispatch, useSelector } from "react-redux";
import { ActionCreators } from "redux-undo";

const useStyles = makeStyles(theme => ({
  defaultCenter: {
    position: "absolute",
    left: "50%",
    top: "6em",
    transform: "translateX(-50%)"
  }
}));

const AppToolBar = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { canUndo, canRedo, freshUpload } = useSelector(state => ({
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    freshUpload: state.present.rawData?.length === 0
  }));

  const performUndo = () => {
    dispatch(ActionCreators.undo());
  };
  const performRedo = () => {
    dispatch(ActionCreators.redo());
  };

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.ctrlKey && event.key === "z" && canUndo) {
        performUndo();
      } else if (event.ctrlKey && event.key === "y" && canRedo) {
        performRedo();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line
  }, [canUndo, canRedo]);
  return (
    <div style={{ padding: 10, marginBottom: "3em" }}>
      <AppBar>
        <Toolbar>
          <Grid justify={"space-between"} container alignItems="center">
            <Grid item xs={4}>
              <Typography color="secondary" align="left" noWrap variant="h4">
                Neat Feat
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Grid container justify={"center"}>
                <Tooltip title={canUndo ? "Ctrl + Z" : ""}>
                  <span>
                    <IconButton
                      aria-label="undo-btn"
                      color="secondary"
                      onClick={performUndo}
                      disabled={!canUndo}
                    >
                      <UndoIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title={canRedo ? "Ctrl + Y" : ""}>
                  <span>
                    <IconButton
                      aria-label="redo-btn"
                      color="secondary"
                      onClick={performRedo}
                      disabled={!canRedo}
                    >
                      <RedoIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Grid container justify="flex-end" spacing={3}>
                <Grid item>
                  <div className={freshUpload ? classes.defaultCenter : ""}>
                    <UploadCSV />
                  </div>
                </Grid>
                <Grid
                  item
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <DownloadCSV />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default AppToolBar;

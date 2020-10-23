import React, { Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Tooltip } from "@material-ui/core";

const StyledTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9"
  }
}))(Tooltip);

const ValueCountsTooltip = props => {
  return (
    <StyledTooltip
      title={
        <Fragment>
          {props.valueCounts.map(([catName, catCount], idx) => (
            <p key={idx}>{`${catName}: ${catCount}`}</p>
          ))}
        </Fragment>
      }
    >
      {props.children}
    </StyledTooltip>
  );
};

export default ValueCountsTooltip;

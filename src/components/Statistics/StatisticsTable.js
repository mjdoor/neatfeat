import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-ui/core";
import ACTIONS from "../../redux/actions";

const StatisticsTable = props => {
  const dispatch = useDispatch();
  const { statsData } = useSelector(state => state);

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => dispatch(ACTIONS.createTestTable())}
      >
        Test Data
      </Button>
      <br />
      {JSON.stringify(statsData)}
    </div>
  );
};

export default StatisticsTable;

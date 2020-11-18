import React, { useState } from "react";
import { Typography, Button } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { BarChart, ScatterChart } from "recharts";

const Graphs = props => {

    return (
        <div>
            <Button variant="contained" color="secondary" size="medium">
                Create Chart
            </Button>
        </div>
    )
}

export default Graphs;
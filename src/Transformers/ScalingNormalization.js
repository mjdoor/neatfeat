import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ACTIONS from "../redux/actions";
import generateScaledNormalizationfromRawData from "../StatisticalFunctions/ScalingNormalization";

const ScalingNormalization = (data, selectedColumns, option, updated) => {
    // const dispatch = useDispatch();

    // dispatch(ACTIONS.scalingNormalization(data, selectedColumns, option, updated));
    const newRawData = generateScaledNormalizationfromRawData(data, selectedColumns, option);

    return newRawData.transformedData;
}

export default ScalingNormalization;
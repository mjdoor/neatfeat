import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    Select,
    MenuItem,
    FormControl, 
    InputLabel,
    DialogContent,
    DialogContentText,
    Button
} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { BarChart, ScatterChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Scatter
 } from "recharts";

 const CustomTooltip = ({ active, payload, label, xAxisColumn, yAxisColumn }) => {
     if(active) {
         return (
             <div>
                 <p>{`${xAxisColumn} : ${label}`}</p>
                 <p>{`${yAxisColumn} : ${payload[0].value}`}</p>
             </div>
         )
     }
     return null;
 };

const ChartDialog = props => {
    //const [selectedChart, setSelectedChart] = useState();
    const { onClose, selectedChart, open, selectedFeatures, rawData, xAxisColumn, yAxisColumn } = props;

    const handleClose = () => {
        onClose();
    }

    return (        
        <Dialog
        onClose={handleClose}
        open={open}
        disableBackdropClick
        disableEscapeKeyDown
        >
            <DialogTitle>
                Chart
                <IconButton aria-label="Close"  onClick={handleClose}>
                 <CloseIcon />
                </IconButton>
            </DialogTitle>
            
            <DialogContent align="center">
                {(() => {
                    switch(selectedChart) {
                        case 'BarChart' : return (
                            <BarChart
                            width={600}
                            height={300}
                            data={rawData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid  stroke="#eee" strokeDasharray="3 3"/>
                                <XAxis dataKey={xAxisColumn} ticks={[10, 20, 30, 40, 50,60,70,80,90, 100]} />
                                <YAxis />
                                <Tooltip content={<CustomTooltip xAxisColumn={xAxisColumn} yAxisColumn={yAxisColumn}/>}/>
                                <Legend />
                                <Bar dataKey={yAxisColumn} fill="primary" />
                            </BarChart>
                        )
                        case 'ScatterChart': return (
                            <ScatterChart
                            width={600}
                            height={300}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid />
                                <XAxis type="number" dataKey={xAxisColumn} name={xAxisColumn} />
                                <YAxis type="number" dataKey={yAxisColumn} name={yAxisColumn} />
                                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                                <Legend />
                                <Scatter
                                name="Median"
                                data={rawData}
                                fill="#8884d8"
                                shape="circle"
                                />
                            </ScatterChart>
                        )
                    }
                })()}
                
            </DialogContent>
        </Dialog>
    )
}

export default ChartDialog;
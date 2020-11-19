import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { ThemeProvider } from "@material-ui/core/styles";
import { Provider } from "react-redux";
import theme from "./themes/theme";

import AppToolBar from "./components/AppToolBar";
import DataGridTable from "./components/DataGridTable";
import StatsData from "./components/Statistics/StatsData";
import DownloadCSV from "./components/DownloadCSV";

import { store } from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <AppToolBar />
        <DataGridTable />
        <StatsData />
        <DownloadCSV />
      </ThemeProvider>
    </Provider>
  );
}

export default App;

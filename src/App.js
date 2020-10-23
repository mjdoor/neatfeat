import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { ThemeProvider } from "@material-ui/core/styles";
import { Provider } from "react-redux";
import theme from "./themes/theme";

import AppToolBar from "./components/AppToolBar";
import UploadCSV from "./components/UploadCSV";
import StatsData from "./components/Statistics/StatsData";

import { store } from "./redux/store";
import DataGridTable from "./components/DataGridTable";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <AppToolBar />
        <StatsData />
      </ThemeProvider>
    </Provider>
  );
}

export default App;

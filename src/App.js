import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { ThemeProvider } from "@material-ui/core/styles";
import { Provider } from "react-redux";
import theme from "./themes/theme";

import Homepage from "./components/Homepage";
import StatisticsTable from "./components/Statistics/StatisticsTable";

import { store } from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Homepage />
        <StatisticsTable />
      </ThemeProvider>
    </Provider>
  );
}

export default App;

import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import dataReducer from "./reducer";
import { loadState, saveState } from "../localStorage/localStorage";

// Load the state in localStorage
const store = createStore(dataReducer, loadState(), applyMiddleware(thunk));

// listen for store changes and use saveState to save them to localStorage
store.subscribe(() => saveState(store.getState()));

export default store;

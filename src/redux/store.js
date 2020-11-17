import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import dataReducer from "./reducer";

export const store = createStore(dataReducer, applyMiddleware(thunk));

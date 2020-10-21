import { createStore } from "redux";
import dataReducer from "./reducer";

export const store = createStore(dataReducer);

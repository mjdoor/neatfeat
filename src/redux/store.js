import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import dataReducer from "./reducer";

import undoable from "redux-undo";
import ACTIONS from "./actions";

const filterActions = (action, currentState, previousHistory) => {
  return action.type !== ACTIONS.Types.APPLY_TRANSFORMATION;
};

const groupRelatedActions = (action, currentState, previousHistory) => {
  if (action.actionId) {
    return action.actionId;
  } else {
    return null;
  }
};

export default createStore(
  undoable(dataReducer, {
    filter: filterActions,
    groupBy: groupRelatedActions
  }),
  applyMiddleware(thunk)
);

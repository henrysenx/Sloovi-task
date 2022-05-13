import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import taskReducer from "./reducers/taskReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import reduxThunk from "redux-thunk";

const middleware = [reduxThunk];

const reducers = combineReducers({
  taskReducer: taskReducer,
});

export const myStore = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(...middleware))
);
